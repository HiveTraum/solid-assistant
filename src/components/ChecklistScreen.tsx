import { useState } from 'react';
import { checklistCategories } from '../data/checklist';

interface ChecklistScreenProps {
  onBack: () => void;
}

export function ChecklistScreen({ onBack }: ChecklistScreenProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>('usecase');

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const getCategoryProgress = (categoryId: string) => {
    const category = checklistCategories.find((c) => c.id === categoryId)!;
    const total = category.items.length;
    const done = category.items.filter((item) => checked.has(item.id)).length;
    return { done, total };
  };

  return (
    <div className="screen checklist-screen">
      <button className="btn-back" onClick={onBack}>
        &larr; Назад
      </button>

      <h1>Чеклист слоёв</h1>
      <p className="checklist-subtitle">
        Определи, к какому слою относится код: отмечай подходящие признаки
      </p>

      <div className="checklist-categories">
        {checklistCategories.map((category) => {
          const { done, total } = getCategoryProgress(category.id);
          const isExpanded = expandedId === category.id;
          const progress = (done / total) * 100;

          return (
            <div key={category.id} className={`checklist-category ${isExpanded ? 'expanded' : ''}`}>
              <button
                className="category-header"
                onClick={() => toggleExpand(category.id)}
                style={{ '--cat-color': category.color } as React.CSSProperties}
              >
                <div className="category-title-row">
                  <span
                    className="category-dot"
                    style={{ background: category.color }}
                  />
                  <h2 className="category-title">{category.title}</h2>
                  <span className="category-count">
                    {done}/{total}
                  </span>
                  <span className={`category-chevron ${isExpanded ? 'open' : ''}`}>&#9662;</span>
                </div>
                <div className="category-progress-bar">
                  <div
                    className="category-progress-fill"
                    style={{ width: `${progress}%`, background: category.color }}
                  />
                </div>
              </button>

              {isExpanded && (
                <div className="category-body">
                  <p className="category-description">{category.description}</p>
                  <ul className="checklist-items">
                    {category.items.map((item) => (
                      <li key={item.id} className="checklist-item">
                        <label className="checklist-label">
                          <input
                            type="checkbox"
                            checked={checked.has(item.id)}
                            onChange={() => toggle(item.id)}
                            className="checklist-checkbox"
                          />
                          <span
                            className="checkmark"
                            style={{ '--cat-color': category.color } as React.CSSProperties}
                          />
                          <span className={`checklist-text ${checked.has(item.id) ? 'done' : ''}`}>
                            {item.text}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="checklist-hint">
        <p>
          <strong>Подсказка:</strong> если большинство пунктов отмечены в одной категории —
          код скорее всего принадлежит этому слою. Если пункты «размазаны» по нескольким —
          возможно, код нарушает разделение ответственности.
        </p>
      </div>
    </div>
  );
}
