import { useState } from 'react'
import { Combobox, Option } from './components'
import styles from './App.module.css'

const options: Option[] = [
  {
    id: 1,
    name: 'Option 1',
  },
  {
    id: 2,
    name: 'Option 2',
  },
  {
    id: 3,
    name: 'Option 3',
  },
]

export const App = () => {
  const [selectedOption, setSelectedOption] = useState<Option>()

  return (
    <div className={styles.app}>
      <div className={styles.appContainer}>
        <Combobox
          defaultValue={selectedOption}
          onChange={setSelectedOption}
          options={options}
        />
      </div>
    </div>
  )
}
