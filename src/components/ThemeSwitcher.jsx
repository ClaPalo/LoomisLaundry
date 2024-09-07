import { Button } from '@nextui-org/react'
import useDarkMode from 'use-dark-mode'

import { MdLightMode } from 'react-icons/md'
import { MdNightlight } from 'react-icons/md'

export const ThemeSwitcher = () => {
    const darkMode = useDarkMode(false, {
        classNameDark: 'dark',
        classNameLight: 'light',
    })

    return (
        <div>
            {darkMode.value ? ( // if dark mode is enabled
                <MdLightMode
                    className="text-white text-2xl hover:text-gray-200 hover:cursor-pointer"
                    onClick={darkMode.disable}
                />
            ) : (
                // if dark mode is disabled
                <MdNightlight
                    className="text-black text-2xl hover:cursor-pointer hover:text-gray-800"
                    onClick={darkMode.enable}
                />
            )}
        </div>
    )
}
