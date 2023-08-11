import { useCallback, useMemo, useReducer, useRef } from 'react'
import styles from './styles.module.css'
import { ArrowDownFilled } from './ArrowDownFilled'

export interface Option {
  id: number
  name: string
}

interface State {
  options: Option[]
  searchPhrase: string
  selectedOption?: Option
  showSuggestions: boolean
  suggestions: Option[]
}

const initialState: State = {
  options: [],
  searchPhrase: '',
  showSuggestions: false,
  suggestions: [],
}

interface UPDATE_SEARCH_PHRASE {
  type: 'UPDATE_SEARCH_PHRASE'
  payload: string
}

interface SHOW_SUGGESTIONS {
  type: 'SHOW_SUGGESTIONS'
}

interface HIDE_SUGGESTIONS {
  type: 'HIDE_SUGGESTIONS'
}

interface SET_SELECTED_OPTION {
  type: 'SET_SELECTED_OPTION'
  payload: Option
}

type Action =
  | UPDATE_SEARCH_PHRASE
  | SHOW_SUGGESTIONS
  | HIDE_SUGGESTIONS
  | SET_SELECTED_OPTION

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SHOW_SUGGESTIONS':
      return {
        ...state,
        showSuggestions: true,
      }
    case 'HIDE_SUGGESTIONS':
      return {
        ...state,
        showSuggestions: false,
      }
    case 'SET_SELECTED_OPTION':
      return {
        ...state,
        showSuggestions: false,
        selectedOption: action.payload,
      }
    case 'UPDATE_SEARCH_PHRASE':
      // Update the phrase so it is visible in the input
      // But also, if the suggestions were invisible and we are going from an
      // emopty phrase to a non-empty phrase, we want to show the suggestions
      // Also, filter the suggestions based on the phrase
      return {
        ...state,
        showSuggestions:
          state.searchPhrase.length === 0 && action.payload.length > 0
            ? true
            : state.showSuggestions,
        searchPhrase: action.payload,
        suggestions:
          action.payload.length > 0
            ? state.options.filter((option) =>
                option.name.includes(action.payload)
              )
            : state.options,
      }
    default:
      return state
  }
}

export const Combobox: React.FC<{
  defaultValue?: Option
  onChange: (option: Option) => void
  options: Option[]
}> = ({ options }) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    options,
  })

  const { searchPhrase, showSuggestions, suggestions } = state

  const containerRef = useRef<HTMLDivElement>(null)

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'UPDATE_SEARCH_PHRASE', payload: event.target.value })
  }

  const onPickOption = (option: Option) => {
    dispatch({ type: 'SET_SELECTED_OPTION', payload: option })
  }

  const { height, width } = useMemo(() => {
    if (!containerRef.current) return { height: 0, width: 0 }
    return {
      height: containerRef.current.getBoundingClientRect().height,
      width: containerRef.current.getBoundingClientRect().width,
    }
  }, [containerRef.current])

  const onToggle = useCallback(() => {
    if (showSuggestions) {
      dispatch({ type: 'HIDE_SUGGESTIONS' })
    } else {
      dispatch({ type: 'SHOW_SUGGESTIONS' })
    }
  }, [])

  console.log(state)

  return (
    <div
      className={styles.combobox}
      data-component="Combobox"
      ref={containerRef}
    >
      <input
        data-testid="combobox-text-input"
        className={styles.input}
        type="text"
        defaultValue={searchPhrase}
        onChange={onInputChange}
        autoComplete="off"
        autoCapitalize="none"
        spellCheck="false"
        role="combobox"
        aria-expanded={showSuggestions}
        aria-controls="combobox-suggestions"
      />
      <button
        type="button"
        className={`${styles.expandButton} ${
          showSuggestions ? styles.open : ''
        }`}
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
            <li key={suggestion.id} className={styles.suggestion}>
              <button
                type="button"
                className={styles.suggestionButton}
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
