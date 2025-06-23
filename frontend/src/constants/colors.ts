export const THEME = {
  background: {
    primary: { hex: '#141824', class: 'bg-[#141824]' },
    secondary: { hex: '#232939', class: 'bg-[#232939]' },
    dark: { hex: '#141824', class: 'bg-[#141824]' },
    darker: { hex: '#0e101a', class: 'bg-[#0e101a]' },
    overlay: { hex: '#12141e', class: 'bg-[#12141e]' },
    dropdown: { hex: '#21283b', class: 'bg-[#21283b]' },
    tooltip: { hex: '#1f2638', class: 'bg-[#1f2638]' },
  },
  
  action: {
    buy: { 
      hex: '#4db6ac', 
      class: 'bg-[#4db6ac] hover:bg-[#3da59b]',
      hoverHex: '#3da59b' 
    },
    sell: { 
      hex: '#e75f77', 
      class: 'bg-[#e75f77] hover:bg-[#d94c65]',
      hoverHex: '#d94c65' 
    }
  },
  
  text: {
    primary: { hex: '#d1d5db', class: 'text-[#d1d5db]' },
    secondary: { hex: '#9ca3af', class: 'text-[#9ca3af]' },
    muted: { hex: '#6b7280', class: 'text-[#6b7280]' },
    buy: { hex: '#4db6ac', class: 'text-[#4db6ac]' },
    sell: { hex: '#e75f77', class: 'text-[#e75f77]' }
  },
  
  chart: {
    grid: '#374151',
    border: '#4b5563',
    crosshair: '#758CA3'
  }
} as const; 