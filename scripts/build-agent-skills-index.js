/* eslint-disable no-console */
/**
 * Generates /.well-known/agent-skills/index.json (Agent Skills Discovery RFC
 * v0.2.0) by scanning every `public/.well-known/agent-skills/<name>/SKILL.md`,
 * reading its frontmatter `name`/`description`, and computing a SHA-256 digest.
 *
 * Runs as part of `postbuild` so the published digests always match the shipped
 * SKILL.md files. Safe to run by hand after editing any SKILL.md.
 */
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://olas.network';
const SCHEMA = 'https://schemas.agentskills.io/discovery/0.2.0/schema.json';
const SKILLS_DIR = path.join(__dirname, '..', 'public', '.well-known', 'agent-skills');

// Minimal YAML-frontmatter reader: pulls a single key from the leading
// `---` block. Avoids adding a YAML dependency for two fields.
function readFrontmatterValue(content, key) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const line = match[1].split('\n').find((l) => l.trim().startsWith(`${key}:`));
  if (!line) return null;
  return line.slice(line.indexOf(':') + 1).trim();
}

function buildIndex() {
  if (!fs.existsSync(SKILLS_DIR)) {
    console.error(`[agent-skills] directory not found: ${SKILLS_DIR}`);
    process.exit(1);
  }

  const skills = fs
    .readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const skillPath = path.join(SKILLS_DIR, entry.name, 'SKILL.md');
      if (!fs.existsSync(skillPath)) return null;

      const content = fs.readFileSync(skillPath, 'utf8');
      const digest = crypto.createHash('sha256').update(content).digest('hex');
      const name = readFrontmatterValue(content, 'name') || entry.name;
      const description = readFrontmatterValue(content, 'description') || '';

      return {
        name,
        type: 'skill-md',
        description,
        url: `${SITE_URL}/.well-known/agent-skills/${entry.name}/SKILL.md`,
        digest: `sha256:${digest}`,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name));

  const index = { $schema: SCHEMA, skills };
  const outPath = path.join(SKILLS_DIR, 'index.json');
  fs.writeFileSync(outPath, `${JSON.stringify(index, null, 2)}\n`);
  console.log(`[agent-skills] wrote ${skills.length} skill(s) to ${outPath}`);
}

buildIndex();
