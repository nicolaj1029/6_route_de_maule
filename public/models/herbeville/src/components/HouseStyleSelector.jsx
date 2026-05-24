import styles from './HouseStyleSelector.module.css'

/**
 * HouseStyleSelector — reusable 2-col option grid.
 * Used for house types, roof types, and mood options.
 */
export default function HouseStyleSelector({ options, selected, onSelect }) {
  return (
    <div className={styles.grid}>
      {options.map(opt => (
        <button
          key={opt.key}
          className={`${styles.card} ${selected === opt.key ? styles.selected : ''}`}
          onClick={() => onSelect(opt.key)}
        >
          <span className={styles.icon}>{opt.icon}</span>
          <span className={styles.name}>{opt.label}</span>
          <span className={styles.desc}>{opt.desc}</span>
        </button>
      ))}
    </div>
  )
}
