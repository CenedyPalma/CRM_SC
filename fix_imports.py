import re

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Remove imports
    content = re.sub(r"import \{ (Input|Label|Textarea|Switch) \} from '@\/components\/ui\/(input|label|textarea|switch)';\n", "", content)
    
    # Replace <Input />
    content = re.sub(r'<Input([^>]*?)size=\{1\}([^>]*?)>', r'<input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"\1\2/>', content)
    
    # Replace <Input className="font-mono text-sm" ... />
    content = re.sub(r'<Input([^>]*?)className="font-mono text-sm"([^>]*?)>', r'<input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"\1\2/>', content)

    # General <Input ... />
    content = re.sub(r'<Input([^>]*?)/>', r'<input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"\1/>', content)

    # Textarea
    content = re.sub(r'<Textarea([^>]*?)/>', r'<textarea className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"\1/>', content)

    # Label
    content = re.sub(r'<Label([^>]*?)>(.*?)</Label>', r'<label\1 className="\1 text-sm font-medium text-slate-700">\2</label>', content)
    content = content.replace('className=" className="', 'className="')

    # Switch
    content = re.sub(r'<Switch\s+id=\{([^}]+)\}\s+checked=\{([^}]+)\}\s+onCheckedChange=\{([^}]+)\}\s*/>', r'<input type="checkbox" id={\1} checked={\2} onChange={(e) => (\3)(e.target.checked)} className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded" />', content)

    with open(filepath, 'w') as f:
        f.write(content)

fix_file('apps/web-core/src/components/low-code/SchemaBuilder.tsx')
fix_file('apps/web-core/src/components/low-code/DynamicForm.tsx')
