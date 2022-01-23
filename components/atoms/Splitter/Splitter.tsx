import classNames from 'classnames'
import { FC } from 'react'
import styles from './Splitter.module.css'

const Splitter: FC<{ str: string; hoverAnimation?: boolean }> = ({
  str,
  hoverAnimation,
}) => {
  const stringSplit = str.split('')

  return (
    <span
      className={classNames(styles.splitterWrapper, {
        [styles.hoverAnimation]: hoverAnimation,
      })}
    >
      {stringSplit.map((char, index) => {
        const style = { animationDelay: index / 20 + 's' }
        return (
          <span style={style} key={`split-char-${str}-${char}-${index}`}>
            {char}
          </span>
        )
      })}
    </span>
  )
}

export default Splitter
