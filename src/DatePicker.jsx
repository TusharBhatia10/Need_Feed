import { useState } from 'react'
import Icon from './Icon'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function parseDate(str) {
  if (!str) return null;
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatValue(date) {
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDisplay(date) {
  if (!date) return '';
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export default function DatePicker({ value, onChange }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selected = parseDate(value);
  const [view, setView] = useState(() => {
    const d = selected || new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const firstDay = new Date(view.year, view.month, 1).getDay();
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();

  const prevMonth = () => {
    setView(v => v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 });
  };
  const nextMonth = () => {
    setView(v => v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 });
  };

  const select = (day) => {
    const d = new Date(view.year, view.month, day);
    if (d < today) return;
    onChange(formatValue(d));
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--line)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      userSelect: 'none',
    }}>
      {/* Selected date display */}
      {selected && (
        <div style={{
          background: 'var(--teal)',
          color: '#fff',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 11.5, opacity: 0.8, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Selected date</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 500, marginTop: 2 }}>{formatDisplay(selected)}</div>
          </div>
          <Icon name="calendar" size={20}/>
        </div>
      )}

      {/* Month navigation */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px 10px',
        borderBottom: '1px solid var(--line-2)',
      }}>
        <button onClick={prevMonth} style={{
          background: 'none', border: '1px solid var(--line)', borderRadius: 8,
          width: 32, height: 32, display: 'grid', placeItems: 'center',
          cursor: 'pointer', color: 'var(--ink-2)',
        }}>
          <Icon name="back" size={14}/>
        </button>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 500 }}>
          {MONTHS[view.month]} {view.year}
        </div>
        <button onClick={nextMonth} style={{
          background: 'none', border: '1px solid var(--line)', borderRadius: 8,
          width: 32, height: 32, display: 'grid', placeItems: 'center',
          cursor: 'pointer', color: 'var(--ink-2)',
        }}>
          <Icon name="arrow" size={14}/>
        </button>
      </div>

      {/* Day headers */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
        padding: '10px 12px 4px',
        gap: 2,
      }}>
        {DAYS.map(d => (
          <div key={d} style={{
            textAlign: 'center', fontSize: 11, fontWeight: 600,
            color: 'var(--ink-4)', letterSpacing: '0.04em',
            padding: '4px 0',
          }}>{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
        padding: '0 12px 14px',
        gap: 2,
      }}>
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`}/>;
          const date = new Date(view.year, view.month, day);
          const isPast = date < today;
          const isToday = date.getTime() === today.getTime();
          const isSelected = selected && date.getTime() === selected.getTime();

          return (
            <button key={day} onClick={() => select(day)} disabled={isPast} style={{
              appearance: 'none',
              border: isToday && !isSelected ? '1.5px solid var(--teal-light)' : '1.5px solid transparent',
              borderRadius: 8,
              background: isSelected ? 'var(--teal)' : 'transparent',
              color: isSelected ? '#fff' : isPast ? 'var(--ink-4)' : isToday ? 'var(--teal-dark)' : 'var(--ink)',
              fontWeight: isSelected || isToday ? 600 : 400,
              fontSize: 13.5,
              padding: '8px 0',
              cursor: isPast ? 'not-allowed' : 'pointer',
              transition: 'all .1s',
              opacity: isPast ? 0.4 : 1,
            }}
            onMouseEnter={e => { if (!isPast && !isSelected) e.currentTarget.style.background = 'var(--bg-2)'; }}
            onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
