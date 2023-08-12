import { useMemo, useRef, useState } from 'react'
import { ArrowDownFilled } from './ArrowDownFilled'
import { ClearX } from './ClearX'
import styles from './styles.module.css'

export interface Option {
  id: number
  name: string
}

export const Combobox: React.FC<{
  defaultValue?: Option
  onChange: (option: Option) => void
  options: Option[]
}> = ({ options }) => {
  const [hoveredOption, setHoveredOption] = useState<Option>()
  const [searchPhrase, setSearchPhrase] = useState<string>('')
  const [selectedOption, setSelectedOption] = useState<Option>()
  const [showSuggestions, setShowSuggestions] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  const suggestions = useMemo(() => {
    if (searchPhrase.length === 0 || selectedOption) return options
    return options.filter((option) =>
      option.name.toLocaleLowerCase().includes(searchPhrase.toLocaleLowerCase())
    )
  }, [options, searchPhrase, selectedOption])

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchPhrase(value)

    if (value.length !== searchPhrase.length) {
      setShowSuggestions(true)
    }
  }

  // Cancelling the button mouse down event prevents the input from losing focus
  const onButtonMousedown: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    event.preventDefault()
  }

  const onFocus = () => {
    setShowSuggestions(true)
  }

  const onBlur: React.FocusEventHandler<HTMLInputElement> = (event) => {
    // if the event is triggered by clicking on the toggle button then cancel the blur event
    if (event.relatedTarget === toggleRef.current) {
      event.preventDefault()
    }

    setShowSuggestions(false)

    if (!selectedOption) {
      setSearchPhrase('')
    }
  }

  const onSelectNext = () => {
    if (!showSuggestions) return

    if (!hoveredOption) {
      setHoveredOption(suggestions[0])
      return
    }

    const index = suggestions.findIndex(
      (suggestion) => suggestion.id === hoveredOption.id
    )
    if (index === -1) return
    if (index === suggestions.length - 1) {
      setHoveredOption(suggestions[0])
      return
    }

    setHoveredOption(suggestions[index + 1])
  }

  const onSelectPrevious = () => {
    if (!showSuggestions) return

    if (!hoveredOption) {
      setHoveredOption(suggestions[suggestions.length - 1])
      return
    }

    const index = suggestions.findIndex(
      (suggestion) => suggestion.id === hoveredOption.id
    )

    if (index === -1) return

    if (index === 0) {
      setHoveredOption(suggestions[suggestions.length - 1])
      return
    }

    setHoveredOption(suggestions[index - 1])
  }

  const onPickOption = (option: Option) => {
    setSelectedOption(option)
    setSearchPhrase(option.name)
    setShowSuggestions(false)
  }

  const onPickHoveredOption = () => {
    if (!hoveredOption || !showSuggestions) return
    onPickOption(hoveredOption)
  }

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    // arrow up/down button should select next/previous list element
    if (event.key === 'ArrowUp') {
      onSelectPrevious()
    } else if (event.key === 'ArrowDown') {
      onSelectNext()
    } else if (event.key === 'Enter') {
      onPickHoveredOption()
    }
  }

  const onClear = () => {
    setSelectedOption(undefined)
    setSearchPhrase('')
    setShowSuggestions(false)
  }

  const onToggle = () => {
    setShowSuggestions((ss) => !ss)
    inputRef.current?.focus()
  }

  const { height, width } = useMemo(() => {
    if (!containerRef.current) return { height: 0, width: 0 }
    return {
      height: containerRef.current.getBoundingClientRect().height + 2,
      width: containerRef.current.getBoundingClientRect().width,
    }
  }, [containerRef.current])

  return (
    <div
      ref={containerRef}
      className={styles.combobox}
      data-component="Combobox"
    >
      <input
        ref={inputRef}
        data-testid="combobox-text-input"
        className={styles.input}
        type="text"
        value={searchPhrase}
        onBlur={onBlur}
        onChange={onInputChange}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        autoComplete="off"
        autoCapitalize="none"
        spellCheck="false"
        role="combobox"
        aria-expanded={showSuggestions}
        aria-controls="combobox-suggestions"
      />

      {searchPhrase.length > 0 && (
        <button
          className={styles.clearButton}
          type="button"
          onMouseDown={onButtonMousedown}
          onClick={onClear}
        >
          <ClearX />
        </button>
      )}

      <button
        ref={toggleRef}
        data-testid="combobox-toggle-button"
        type="button"
        className={`${styles.expandButton} ${
          showSuggestions ? styles.open : ''
        }`}
        onMouseDown={onButtonMousedown}
        onClick={onToggle}
      >
        <ArrowDownFilled />
      </button>
      {showSuggestions && (
        <ul
          className={styles.suggestions}
          id="combobox-suggestions"
          style={{
            width,
            transform: `translate3d(0px, ${height}px, 0)`,
          }}
        >
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              className={`${styles.suggestion} ${
                suggestion === hoveredOption ? styles.selected : ''
              }`}
            >
              <button
                type="button"
                className={styles.suggestionButton}
                onMouseDown={onButtonMousedown}
                onClick={() => onPickOption(suggestion)}
              >
                {suggestion.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
