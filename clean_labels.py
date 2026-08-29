import re

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Fix broken labels
    content = re.sub(r'<label\s+className="[^"]+"\s+className="[^"]+"\s+text-sm\s+font-medium\s+text-slate-700">(.*?)</label>', r'<label className="text-sm font-medium text-slate-700">\1</label>', content)
    content = re.sub(r'<label\s+className="[^"]+"\s*text-sm\s+font-medium\s+text-slate-700">(.*?)</label>', r'<label className="text-sm font-medium text-slate-700">\1</label>', content)

    with open(filepath, 'w') as f:
        f.write(content)

fix_file('apps/web-core/src/components/low-code/SchemaBuilder.tsx')
fix_file('apps/web-core/src/components/low-code/DynamicForm.tsx')
