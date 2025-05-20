// plugins/heroui.js
import * as HeroIcons from '@heroicons/vue'
import { 
  Menu, MenuButton, MenuItems, MenuItem,
  Dialog, DialogPanel, DialogTitle,
  Disclosure, DisclosureButton, DisclosurePanel,
  Listbox, ListboxButton, ListboxOptions, ListboxOption,
  Combobox, ComboboxInput, ComboboxButton, ComboboxOptions, ComboboxOption,
  Switch,
  Tab, TabGroup, TabList, TabPanel, TabPanels,
  Popover, PopoverButton, PopoverGroup, PopoverPanel
} from '@headlessui/vue'

export default {
  install: (app) => {
    // Register all HeroIcons as global components
    Object.entries(HeroIcons).forEach(([name, component]) => {
      app.component(name, component)
    })

    // Register Headless UI components
    app.component('HMenu', Menu)
    app.component('HMenuButton', MenuButton)
    app.component('HMenuItems', MenuItems)
    app.component('HMenuItem', MenuItem)

    app.component('HDialog', Dialog)
    app.component('HDialogPanel', DialogPanel)
    app.component('HDialogTitle', DialogTitle)

    app.component('HDisclosure', Disclosure)
    app.component('HDisclosureButton', DisclosureButton)
    app.component('HDisclosurePanel', DisclosurePanel)

    app.component('HListbox', Listbox)
    app.component('HListboxButton', ListboxButton)
    app.component('HListboxOptions', ListboxOptions)
    app.component('HListboxOption', ListboxOption)

    app.component('HCombobox', Combobox)
    app.component('HComboboxInput', ComboboxInput)
    app.component('HComboboxButton', ComboboxButton)
    app.component('HComboboxOptions', ComboboxOptions)
    app.component('HComboboxOption', ComboboxOption)

    app.component('HSwitch', Switch)

    app.component('HTab', Tab)
    app.component('HTabGroup', TabGroup)
    app.component('HTabList', TabList)
    app.component('HTabPanel', TabPanel)
    app.component('HTabPanels', TabPanels)

    app.component('HPopover', Popover)
    app.component('HPopoverButton', PopoverButton)
    app.component('HPopoverGroup', PopoverGroup)
    app.component('HPopoverPanel', PopoverPanel)
  }
}
