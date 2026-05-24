import styles from './GardenSelector.module.css'

export default function GardenSelector({ options, selected, onToggle }) {
  return (
    <div>
      <p className={styles.hint}>Selection multiple possible</p>
      <div className={styles.grid}>
        {options.map((option) => (
          <button
            key={option.key}
            className={`${styles.tag} ${selected.includes(option.key) ? styles.selected : ''}`}
            onClick={() => onToggle(option.key)}
          >
            <span>{option.icon}</span>
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
