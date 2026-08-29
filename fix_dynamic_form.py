import re

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    content = content.replace('<Input', '<input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"')
    
    with open(filepath, 'w') as f:
        f.write(content)

fix_file('apps/web-core/src/components/low-code/DynamicForm.tsx')
