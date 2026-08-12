'use client';

import React, { useId, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableItem({ id, content }: { id: string, content: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 mb-3 bg-[#111] border-2 border-gray-800 rounded-xl cursor-grab active:cursor-grabbing text-gray-200 font-medium hover:border-gray-600 transition-colors"
    >
      {content}
    </div>
  );
}

interface SequenceOrderingProps {
  question: any;
  onComplete: (isCorrect: boolean) => void;
}

export default function SequenceOrdering({ question, onComplete }: SequenceOrderingProps) {
  const [items, setItems] = useState(question.items);
  const dndId = useId();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items: any[]) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const handleSubmit = () => {
    const currentOrder = items.map((i: any) => i.id);
    const isCorrect = JSON.stringify(currentOrder) === JSON.stringify(question.correctOrder);
    onComplete(isCorrect);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-6 text-white">{question.text}</h2>
      <DndContext 
        id={dndId}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={items.map((i: any) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item: any) => (
            <SortableItem key={item.id} id={item.id} content={item.content} />
          ))}
        </SortableContext>
      </DndContext>
      <button 
        onClick={handleSubmit}
        className="mt-8 w-full py-4 bg-gradient-to-r from-[#ff0055] to-[#e60039] hover:from-[#e60039] hover:to-[#ff0055] text-white font-bold rounded-xl uppercase tracking-widest transition-all"
      >
        Submit Sequence
      </button>
    </div>
  );
}
