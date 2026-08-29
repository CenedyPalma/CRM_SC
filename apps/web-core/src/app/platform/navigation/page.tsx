'use client';

import React, { useState } from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { LayoutList, GripVertical, Settings2, Plus, Box, FileText } from 'lucide-react';

interface NavItem {
  id: string;
  title: string;
  type: string;
}

function SortableNavItem({ item }: { item: NavItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg shadow-sm mb-2 group">
      <div {...attributes} {...listeners} className="cursor-grab text-slate-400 hover:text-slate-600">
        <GripVertical size={18} />
      </div>
      <div className="flex-1">
        <div className="font-medium text-sm text-slate-800">{item.title}</div>
        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
          {item.type === 'object' ? <Box size={10} /> : <FileText size={10} />}
          {item.type === 'object' ? 'Custom Object' : 'Custom Page'}
        </div>
      </div>
      <button className="p-1.5 text-slate-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
        <Settings2 size={16} />
      </button>
    </div>
  );
}

export default function NavigationBuilderPage() {
  const [items, setItems] = useState<NavItem[]>([
    { id: '1', title: 'Dashboard', type: 'page' },
    { id: '2', title: 'Deals', type: 'object' },
    { id: '3', title: 'Contacts', type: 'object' },
    { id: '4', title: 'Vehicles', type: 'object' },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <div className="p-6 h-full bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <LayoutList className="text-indigo-600" size={24} />
              Navigation Builder
            </h1>
            <p className="text-sm text-slate-500 mt-1">Drag and drop to configure the sidebar menu for your users.</p>
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm">
            Save Layout
          </button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-4 bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">Available Items</h3>
            
            <div className="space-y-3">
              <div>
                <div className="text-xs font-medium text-slate-500 mb-2">Custom Objects</div>
                <button className="w-full flex items-center justify-between p-2 text-sm text-slate-700 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 rounded-md transition-colors">
                  <span className="flex items-center gap-2"><Box size={14} className="text-slate-400" /> Properties</span>
                  <Plus size={14} className="text-indigo-600" />
                </button>
              </div>
              
              <div>
                <div className="text-xs font-medium text-slate-500 mb-2 mt-4">Custom Pages</div>
                <button className="w-full flex items-center justify-between p-2 text-sm text-slate-700 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 rounded-md transition-colors">
                  <span className="flex items-center gap-2"><FileText size={14} className="text-slate-400" /> Sales Report</span>
                  <Plus size={14} className="text-indigo-600" />
                </button>
              </div>
            </div>
          </div>

          <div className="col-span-8 bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-6">Sidebar Layout</h3>
            
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={items.map(i => i.id)}
                strategy={verticalListSortingStrategy}
              >
                {items.map(item => (
                  <SortableNavItem key={item.id} item={item} />
                ))}
              </SortableContext>
            </DndContext>
            
          </div>
        </div>
      </div>
    </div>
  );
}
