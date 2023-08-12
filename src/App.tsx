import { useState } from 'react'
import { Combobox, Option } from './components'
import styles from './App.module.css'

const options: Option[] = [
  {
    id: 1,
    name: 'Fred',
  },
  {
    id: 2,
    name: 'Barney',
  },
  {
    id: 3,
    name: 'Wilma',
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
