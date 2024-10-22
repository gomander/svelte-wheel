import { browser } from '$app/environment'

type Serializer<T> = {
  serialize: (value: T) => string
  deserialize: (value: string) => T
}

type StorageType = 'localStorage' | 'sessionStorage'

interface Options<T> {
  type?: StorageType
  serializer?: Serializer<T>
  syncTabs?: boolean
  onReadError?: (error: unknown) => void
  onWriteError?: (error: unknown) => void
  beforeRead?: (value: T) => T
  beforeWrite?: (value: T) => T
}

export function persistedState<T>(
  key: string,
  initialValue: T,
  options: Options<T> = {}
) {
  const {
    type = 'localStorage',
    serializer = { serialize: JSON.stringify, deserialize: JSON.parse },
    syncTabs = true,
    onReadError = console.error,
    onWriteError = console.error,
    beforeRead = v => v,
    beforeWrite = v => v
  } = options

  const storage = browser ? window[type] : null!

  let storedValue: T

  try {
    const item = storage?.getItem(key)
    storedValue = item ? beforeRead(serializer.deserialize(item)) : initialValue
  } catch (error) {
    onReadError(error)
    storedValue = initialValue
  }

  let state = $state(storedValue)

  function updateStorage(value: T) {
    try {
      const valueToStore = beforeWrite(value)
      storage.setItem(key, serializer.serialize(valueToStore))
    } catch (error) {
      onWriteError(error)
    }
  }

  if (syncTabs && browser && type === 'localStorage') {
    addEventListener('storage', event => {
      if (event.key === key && event.storageArea === localStorage) {
        try {
          const newValue = event.newValue ? serializer.deserialize(event.newValue) : initialValue
          state = beforeRead(newValue)
        } catch (error) {
          onReadError(error)
        }
      }
    })
  }

  $effect.root(() => {
    $effect(() => {
      updateStorage(state)
    })
  })

  return {
    get value() {
      return state
    },
    set value(newValue: T) {
      state = newValue
    },
    update(updateFn: (value: T) => T) {
      state = updateFn(state)
    },
    reset() {
      state = initialValue
    }
  }
}
