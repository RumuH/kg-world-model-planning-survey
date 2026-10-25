import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// Run from the project root using the bundled runtime. A reviewed Artifact
// Session snapshot is required at .presentation_build/deck.proto.json.
const root = process.cwd();
const modules = process.env.PRESENTATION_RUNTIME_MODULES;
const skill = process.env.PRESENTATION_SKILL_DIR;
const python = process.env.PRESENTATION_RUNTIME_PYTHON;
if (!modules || !skill || !python) throw new Error('Set the three PRESENTATION_* runtime paths.');
process.env.RUNTIME_NODE_MODULES ??= modules;
process.env.RUNTIME_NODE ??= process.execPath;
const { Presentation, PresentationFile } = await import(pathToFileURL(path.join(modules, '@oai/artifact-tool/dist/artifact_tool.mjs')).href);
const { finalizePresentation } = await import(pathToFileURL(path.join(skill,'container_tools/artifact_tool_utils.mjs')).href);
const proto=JSON.parse(await fs.readFile(path.join(root,'.presentation_build/deck.proto.json'),'utf8'));
const deck=await Presentation.load(proto);
// Live media handles are session-local. Embed the same concrete asset bytes in
// the standalone model before exporting the native Office file.
const media = await deck.inspect({kind:'image',maxChars:6000});
const mediaRecords = media.records ?? media.ndjson.split('\n').filter(Boolean).map(line=>JSON.parse(line));
for (const rec of mediaRecords) {
  const file = rec.slideIndex === 0 ? 'cover_network.png' : rec.slideIndex === 10 ? 'davis_query.png' : null;
  if (!file) throw new Error('An image has no declared local source.');
  const bytes = await fs.readFile(path.join(root,'presentations/assets',file));
  deck.resolve(rec.id).replace({dataUrl:'data:image/png;base64,'+bytes.toString('base64'),contentType:'image/png',alt:file});
}
const draft=path.join(root,'.presentation_build/meeting-draft.pptx');
await (await PresentationFile.exportPptx(deck)).save(draft);
const tables=[2,3,4,8,14,16,17,18,19,24];
const final=path.join(root,'presentations/output/kg_world_model_lab_meeting_20261025.pptx');
const result=await finalizePresentation({
  workspaceDir:root,candidatePath:draft,finalPath:final,pythonExecutable:python,
  integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),
  layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),
  layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(n=>['--require-native-table-slide',String(n)])],
  explicitTotalSlideCount:24,requiredNativeTableOwnerSlides:tables,
  fontPolicy:{basis:'design',families:['Arial Unicode MS']},
  verifyArtifactToolImport:true,
  receiptPath:path.join(root,'.presentation_build/pptx-validation-'+Date.now()+'.json')
});
console.log(JSON.stringify({final,result}));
