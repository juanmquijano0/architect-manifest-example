import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import YAML from 'yaml';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import SwaggerParser from '@apidevtools/swagger-parser';
import { Parser, fromFile } from '@asyncapi/parser';
import { glob } from 'glob';

const root = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const diagramsOnly = process.argv.includes('--diagrams-only');
const errors = [];
const execFileAsync = promisify(execFile);

function rel(file) {
  return path.relative(root, file).replaceAll(path.sep, '/');
}

async function readText(file) {
  return fs.readFile(file, 'utf8');
}

async function readJson(file) {
  return JSON.parse(await readText(file));
}

function fail(message) {
  errors.push(message);
}

async function assertExists(relativePath, context) {
  const full = path.join(root, relativePath);
  try {
    const stat = await fs.stat(full);
    if (!stat.isFile()) fail(`${context}: ${relativePath} is not a file`);
  } catch {
    fail(`${context}: ${relativePath} does not exist`);
  }
}

async function validateJsonAndSchemas() {
  const jsonFiles = await glob('**/*.json', { cwd: root, ignore: ['node_modules/**', 'package-lock.json'] });
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);

  for (const file of jsonFiles) {
    const full = path.join(root, file);
    let parsed;
    try {
      parsed = await readJson(full);
    } catch (error) {
      fail(`${file}: invalid JSON: ${error.message}`);
      continue;
    }
    if (file.endsWith('.schema.json') || file === 'manifest/architect-manifest.schema.json') {
      try {
        ajv.compile(parsed);
      } catch (error) {
        fail(`${file}: invalid JSON Schema: ${error.message}`);
      }
    }
  }

  const eventExamples = [
    ['contracts/schemas/order-created.v1.schema.json', 'examples/events/order-created.v1.json'],
    ['contracts/schemas/order-fulfilled.v1.schema.json', 'examples/events/order-fulfilled.v1.json'],
    ['contracts/schemas/order-rejected.v1.schema.json', 'examples/events/order-rejected.v1.json']
  ];

  for (const [schemaPath, examplePath] of eventExamples) {
    const schema = await readJson(path.join(root, schemaPath));
    const example = await readJson(path.join(root, examplePath));
    const validate = ajv.getSchema(schema.$id) ?? ajv.compile(schema);
    if (!validate(example)) {
      fail(`${examplePath}: does not match ${schemaPath}: ${ajv.errorsText(validate.errors)}`);
    }
  }
}

async function validateYaml() {
  const yamlFiles = await glob('**/*.{yaml,yml}', { cwd: root, ignore: ['node_modules/**'] });
  for (const file of yamlFiles) {
    try {
      YAML.parse(await readText(path.join(root, file)));
    } catch (error) {
      fail(`${file}: invalid YAML: ${error.message}`);
    }
  }
}

async function validateManifest() {
  const schema = await readJson(path.join(root, 'manifest/architect-manifest.schema.json'));
  const manifest = YAML.parse(await readText(path.join(root, 'manifest/architect-manifest.yaml')));
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(schema);
  if (!validate(manifest)) {
    fail(`manifest/architect-manifest.yaml: schema errors: ${ajv.errorsText(validate.errors)}`);
  }

  const ids = new Map();
  const collect = (item, section) => {
    if (!item?.id) return;
    if (ids.has(item.id)) fail(`Duplicate manifest ID ${item.id} in ${section}; first seen in ${ids.get(item.id)}`);
    ids.set(item.id, section);
  };

  collect(manifest.solution, 'solution');
  for (const section of ['documents', 'diagrams', 'adrs', 'apis', 'events', 'dataStores', 'components', 'qualityAttributes', 'implementationConstraints']) {
    for (const item of manifest[section] ?? []) {
      collect(item, section);
      await assertExists(item.path, `manifest ${section} ${item.id}`);
    }
  }
  for (const item of manifest.openQuestions ?? []) {
    collect(item, 'openQuestions');
    await assertExists(item.path, `manifest openQuestions ${item.id}`);
  }
  for (const item of manifest.risks ?? []) {
    collect(item, 'risks');
    await assertExists(item.path, `manifest risks ${item.id}`);
  }

  const verifyRelated = (item, section) => {
    for (const relatedId of item.related ?? []) {
      if (!ids.has(relatedId)) {
        fail(`manifest ${section} ${item.id}: related ID ${relatedId} is not declared`);
      }
    }
  };
  for (const section of ['documents', 'diagrams', 'adrs', 'apis', 'events', 'dataStores', 'components', 'qualityAttributes', 'implementationConstraints']) {
    for (const item of manifest[section] ?? []) verifyRelated(item, section);
  }
  for (const item of manifest.risks ?? []) {
    if (!ids.has(item.related)) fail(`manifest risks ${item.id}: related ID ${item.related} is not declared`);
  }
}

async function validateOpenApi() {
  try {
    await SwaggerParser.validate('contracts/openapi/orders-api.yaml');
  } catch (error) {
    fail(`contracts/openapi/orders-api.yaml: invalid OpenAPI: ${error.message}`);
  }
}

async function validateAsyncApi() {
  try {
    const parser = new Parser();
    const result = await fromFile(parser, path.join(root, 'contracts/asyncapi/order-events.yaml')).parse();
    const diagnostics = result?.diagnostics ?? [];
    const severe = diagnostics.filter((diagnostic) => diagnostic.severity === 0 || diagnostic.severity === 'error');
    if (severe.length > 0) {
      fail(`contracts/asyncapi/order-events.yaml: AsyncAPI parser errors: ${severe.map((d) => d.message).join('; ')}`);
    }
  } catch (error) {
    fail(`contracts/asyncapi/order-events.yaml: invalid AsyncAPI: ${error.message}`);
  }
}

async function validateMermaid() {
  const files = await glob('diagrams/*.mmd', { cwd: root });
  const outDir = await fs.mkdtemp(path.join(os.tmpdir(), 'orderflow-diagrams-'));
  const mmdc = path.join(root, 'node_modules', '.bin', process.platform === 'win32' ? 'mmdc.cmd' : 'mmdc');
  const puppeteerConfig = path.join(root, 'scripts', 'puppeteer-config.json');
  for (const file of files) {
    try {
      const output = path.join(outDir, `${path.basename(file, '.mmd')}.svg`);
      await execFileAsync(mmdc, ['-i', path.join(root, file), '-o', output, '-p', puppeteerConfig], {
        cwd: root,
        timeout: 30000
      });
    } catch (error) {
      fail(`${file}: invalid or non-renderable Mermaid: ${error.stderr || error.message}`);
    }
  }
}

async function validateMarkdownLinks() {
  const files = await glob('**/*.md', { cwd: root, ignore: ['node_modules/**'] });
  const markdownLinkPattern = /\[[^\]]+\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  for (const file of files) {
    const full = path.join(root, file);
    const text = await readText(full);
    for (const match of text.matchAll(markdownLinkPattern)) {
      const raw = match[1];
      if (/^(https?:|mailto:|#)/.test(raw)) continue;
      const [target] = raw.split('#');
      if (!target) continue;
      const decoded = decodeURIComponent(target);
      const resolved = decoded.startsWith('/')
        ? path.join(root, decoded.slice(1))
        : path.resolve(path.dirname(full), decoded);
      if (!resolved.startsWith(root)) {
        fail(`${file}: link escapes repository: ${raw}`);
        continue;
      }
      try {
        await fs.stat(resolved);
      } catch {
        fail(`${file}: broken link ${raw}`);
      }
    }
  }
}

async function validateNoInternalReferences() {
  const files = await glob('**/*.{md,yaml,yml,json,mmd}', { cwd: root, ignore: ['node_modules/**', 'package-lock.json'] });
  const forbidden = [
    new RegExp(`Banco${'lombia'}`, 'i'),
    new RegExp(`/${'Users'}/`),
    new RegExp(`juan${'quijano'}`, 'i')
  ];
  for (const file of files) {
    const text = await readText(path.join(root, file));
    for (const pattern of forbidden) {
      if (pattern.test(text)) {
        fail(`${file}: contains forbidden internal/local reference matching ${pattern}`);
      }
    }
  }
}

async function main() {
  if (diagramsOnly) {
    await validateMermaid();
  } else {
    await validateJsonAndSchemas();
    await validateYaml();
    await validateManifest();
    await validateOpenApi();
    await validateAsyncApi();
    await validateMarkdownLinks();
    await validateNoInternalReferences();
    await validateMermaid();
  }

  if (errors.length > 0) {
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log(diagramsOnly ? 'Diagram validation passed.' : 'Architecture validation passed.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
