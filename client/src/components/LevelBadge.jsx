export default function LevelBadge({ level }) {
  const styles = {
    beginner: 'badge-green',
    intermediate: 'badge-yellow',
    experienced: 'badge-purple',
  }
  return (
    <span className={`badge ${styles[level] || 'badge-blue'} capitalize`}>
      {level}
    </span>
  )
}
