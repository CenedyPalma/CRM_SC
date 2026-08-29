'use client';

import React, { useState } from 'react';
import { 
  DndContext, 
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent
} from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { LayoutGrid, BarChart2, Table, Layout, CreditCard, BoxSelect, Columns, Type, Hash, GripHorizontal } from 'lucide-react';

const availableWidgets = [
  { type: 'metric', name: 'Metric Card', icon: <Hash size={16} /> },
  { type: 'chart', name: 'Bar Chart', icon: <BarChart2 size={16} /> },
  { type: 'table', name: 'Data Table', icon: <Table size={16} /> },
  { type: 'text', name: 'Rich Text', icon: <Type size={16} /> },
  { type: 'kanban', name: 'Kanban Board', icon: <Columns size={16} /> },
];

function SortableWidget({ id, widgetType }: { id: string, widgetType: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const widget = availableWidgets.find(w => w.type === widgetType);

  return (
    <div ref={setNodeRef} style={style} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-48 group">
      <div 
        className="h-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between px-3 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
        {...attributes} 
        {...listeners}
      >
        <GripHorizontal size={14} className="text-slate-400" />
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{widget?.name}</span>
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center text-slate-400">
          <div className="mx-auto w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-2">
             {widget?.icon}
          </div>
          <p className="text-sm font-medium">{widget?.name} Placeholder</p>
        </div>
      </div>
    </div>
  );
}

export function UIBuilder() {
  const [layout, setLayout] = useState([
    { id: 'w1', type: 'metric' },
    { id: 'w2', type: 'metric' },
    { id: 'w3', type: 'metric' },
    { id: 'w4', type: 'chart' },
    { id: 'w5', type: 'table' },
  ]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setLayout(prev => {
        const oldIndex = prev.findIndex(w => w.id === active.id);
        const newIndex = prev.findIndex(w => w.id === over.id);
        const newLayout = [...prev];
        const [moved] = newLayout.splice(oldIndex, 1);
        newLayout.splice(newIndex, 0, moved);
        return newLayout;
      });
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-100">
      {/* Topbar */}
      <div className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <LayoutGrid size={20} className="text-indigo-600" />
          <div>
            <h1 className="font-semibold text-slate-900 leading-tight">Sales Dashboard</h1>
            <p className="text-xs text-slate-500">Custom Page Layout</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-md transition-colors">
            Preview
          </button>
          <button className="px-4 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 shadow-sm transition-colors">
            Save Page
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Widget Toolbox */}
        <div className="w-64 bg-white border-r border-slate-200 p-4 overflow-y-auto">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Widget Library</h2>
          <div className="space-y-2">
            {availableWidgets.map(widget => (
              <div 
                key={widget.type}
                className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50/50 cursor-pointer transition-all group"
              >
                <div className="text-slate-500 group-hover:text-indigo-600">
                  {widget.icon}
                </div>
                <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-900">{widget.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-3 gap-6">
                <SortableContext items={layout.map(w => w.id)} strategy={rectSortingStrategy}>
                  {layout.map((widget, idx) => (
                    <div key={widget.id} className={widget.type === 'chart' || widget.type === 'table' ? 'col-span-3' : 'col-span-1'}>
                      <SortableWidget id={widget.id} widgetType={widget.type} />
                    </div>
                  ))}
                </SortableContext>
              </div>
            </DndContext>
          </div>
        </div>
      </div>
    </div>
  );
}
