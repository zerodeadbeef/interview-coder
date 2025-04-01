import React from "react"

interface LanguageSelectorProps {
  currentLanguage: string
  onChange: (language: string) => void
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onChange
}) => {
  const handleLanguageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLanguage = e.target.value
    onChange(newLanguage)
  }

  return (
    <div className="mb-3 px-2 space-y-1">
      <div className="flex items-center justify-between text-[13px] font-medium text-white/90">
        <span>Language</span>
        <select
          value={currentLanguage}
          onChange={handleLanguageChange}
          className="bg-white/10 rounded px-2 py-1 text-sm outline-none border border-white/10 focus:border-white/20"
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
          <option value="golang">Go</option>
          <option value="cpp">C++</option>
          <option value="swift">Swift</option>
          <option value="kotlin">Kotlin</option>
          <option value="ruby">Ruby</option>
          <option value="sql">SQL</option>
          <option value="r">R</option>
        </select>
      </div>
    </div>
  )
}
