import re

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    content = re.sub(r'<Label([^>]*?)>(.*?)</Label>', r'<label\1 className="\1 text-sm font-medium text-slate-700">\2</label>', content)
    content = content.replace('className=" className="', 'className="')

    with open(filepath, 'w') as f:
        f.write(content)

fix_file('apps/web-core/src/components/low-code/DynamicForm.tsx')
