import { useEffect, useMemo, useState } from "react";
import styles from "./styles.module.css";

interface Option {
  id: number;
  name: string;
}

const options: Option[] = [
  {
    id: 1,
    name: "Option 1",
  },
  {
    id: 2,
    name: "Option 2",
  },
  {
    id: 3,
    name: "Option 3",
  },
];

const App = () => {
  const [selectedOption, setSelectedOption] = useState<Option>();
  const [toggle, setToggle] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState("");

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    setFilter(value);
  };

  const onPickOption = (option: Option) => {
    setSelectedOption(option);
    setToggle(false);
    setInputValue(option.name);
  };

  useEffect(() => {
    setInputValue(selectedOption?.name || "");
  }, [selectedOption]);

  const filteredOptions = useMemo(() => {
    if (!filter || filter.length < 3) return options;
    return options.filter((option) => option.name.includes(filter));
  }, [filter]);

  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        type="text"
        defaultValue={inputValue}
        onChange={onInputChange}
      />
      <button
        className={styles.expandButton}
        onClick={() => setToggle(!toggle)}
      >
        +
      </button>
      {toggle && (
        <ul className={styles.suggestions}>
          {filteredOptions.map((option) => (
            <li key={option.id} className={styles.suggestion}>
              <button
                className={styles.suggestionButton}
                onClick={() => onPickOption(option)}
              >
                {option.name}
              </button>
            </li>
          ))}
        </ul>
      )}
      <hr />
      <div className={styles.answer}>
        <p>Selected option: {selectedOption?.name}</p>
      </div>
    </div>
  );
};

export default App;
