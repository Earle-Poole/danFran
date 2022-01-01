import { FC } from 'react'
import styles from './Splitter.module.css'

const Splitter: FC<{ str: string }> = ({ str }) => {
  const stringSplit = str.split('')

  return (
    <span className={styles.splitterWrapper}>
      {stringSplit.map((char, index) => {
        const style = { animationDelay: index / 20 + 's' }
        return (
          <span style={style} key={`split-char-${char}`}>
            {char}
          </span>
        )
      })}
    </span>
  )
}

export default Splitter
