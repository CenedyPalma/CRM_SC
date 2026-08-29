import re

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Fix broken labels
    content = re.sub(r'<label\s+className="[^"]+"\s+className="[^"]+"\s+text-sm[^>]*>(.*?)</label>', r'<label className="text-sm font-medium text-slate-700">\1</label>', content)
    content = re.sub(r'<label\s+className="[^"]*"\s*text-sm[^>]*>(.*?)</label>', r'<label className="text-sm font-medium text-slate-700">\1</label>', content)
    
    # Replace <Input />
    content = re.sub(r'<Input([^>]*?)size=\{1\}([^>]*?)/>', r'<input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"\1\2/>', content)
    content = re.sub(r'<Input([^>]*?)className="font-mono text-sm"([^>]*?)/>', r'<input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"\1\2/>', content)
    content = re.sub(r'<Input([^>]*?)/>', r'<input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"\1/>', content)
    
    # Replace multiline <Input
    content = content.replace('<Input', '<input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"')

    with open(filepath, 'w') as f:
        f.write(content)

fix_file('apps/web-core/src/components/low-code/SchemaBuilder.tsx')
fix_file('apps/web-core/src/components/low-code/DynamicForm.tsx')
