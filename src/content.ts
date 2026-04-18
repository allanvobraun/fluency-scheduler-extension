console.log('Fluency Calendar Extension active.');

const createCalendarLink = (title: string, dateStr: string, description: string) => {
  // Expected dateStr format: "Sábado, 21/02 - 09h45"
  const dateMatch = dateStr.match(/(\d{2})\/(\d{2})\s*-\s*(\d{2})h(\d{2})/);
  if (!dateMatch) {
    console.warn('Failed to parse date string:', dateStr);
    return null;
  }

  const [_, day, month, hour, minute] = dateMatch;
  const now = new Date();
  let year = now.getFullYear();
  
  // Create start date (JS months are 0-indexed)
  const startDate = new Date(year, parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));
  
  // If the session date is earlier than now, it might be for next year
  // (e.g., if today is Dec 2025 and session is in Jan 01/01)
  if (startDate.getTime() < now.getTime() - 24 * 60 * 60 * 1000) {
    startDate.setFullYear(year + 1);
  }
  
  // End date (assume 45 minutes duration if not specified, typical for these sessions)
  const endDate = new Date(startDate.getTime() + 45 * 60000);

  const formatTime = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, '');

  const url = new URL('https://www.google.com/calendar/render');
  url.searchParams.append('action', 'TEMPLATE');
  url.searchParams.append('text', `${title}`);
  url.searchParams.append('dates', `${formatTime(startDate)}/${formatTime(endDate)}`);
  url.searchParams.append('details', description);
  url.searchParams.append('location', 'https://academy.fluency.io/');

  return url.toString();
};

const addCalendarButtons = () => {
  // Find all "Ver material" buttons
  const buttons = Array.from(document.querySelectorAll('button')).filter(b => 
    b.textContent?.includes('Ver material') || b.textContent?.includes('Cancelar sessão')
  );

  buttons.forEach(btn => {
    // We only want to add it once per session card. 
    // Usually "Ver material" and "Cancelar sessão" are siblings in the same container.
    const container = btn.parentElement;
    if (!container || container.querySelector('.add-to-calendar-btn')) return;

    // Find the session card container (usually a few levels up)
    // We'll search upwards until we find a container that contains a date string
    let card: HTMLElement | null = btn.parentElement;
    let dateStr = '';
    let foundDate = false;

    // Try to find the date string in the card or its siblings
    // The snapshot shows date is a text node sibling or nearby
    while (card && card.tagName !== 'BODY') {
      const cardText = card.textContent || '';
      const dateMatch = cardText.match(/([A-Z][a-z]+, )?\d{2}\/\d{2} - \d{2}h\d{2}/);
      if (dateMatch) {
        dateStr = dateMatch[0];
        foundDate = true;
        break;
      }
      card = card.parentElement;
    }

    if (foundDate && card) {
      // Extract session info from the card
      const allTextElements = Array.from(card.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6'));
      
      // Try to find the title. It's often "Intermediário Science" or similar.
      // In the snapshot it appears after "Sessão individual" or "Sessão em grupo"
      let title = 'Sessão de Conversação';
      const typeElement = allTextElements.find(el => 
        el.textContent?.includes('Sessão individual') || el.textContent?.includes('Sessão em grupo')
      );
      
      if (typeElement) {
        // Look for the next text element which is likely the title
        const parent = typeElement.parentElement;
        if (parent) {
          const siblings = Array.from(parent.children);
          const typeIndex = siblings.indexOf(typeElement);
          if (typeIndex !== -1 && siblings[typeIndex + 1]) {
            title = siblings[typeIndex + 1].textContent?.trim() || title;
          }
        }
      } else {
        // Fallback to searching for known title patterns or just any heading
        const heading = card.querySelector('h3, h4, h5');
        if (heading) title = heading.textContent?.trim() || title;
      }

      // Look for teacher name (usually near an img with alt=teacher name or just a text node)
      let teacher = '';
      const teacherImg = card.querySelector('img[alt]');
      if (teacherImg) {
        teacher = teacherImg.getAttribute('alt') || '';
      }
      
      if (!teacher) {
        // Fallback: look for a short text string that looks like a name (not date, not type)
        const possibleNames = allTextElements.filter(el => {
          const text = el.textContent?.trim() || '';
          return text.length > 3 && text.length < 40 && 
                 !text.includes('/') && !text.includes('h') && 
                 !text.includes('Sessão') && !text.includes('Ver material');
        });
        if (possibleNames.length > 0) {
          teacher = possibleNames[possibleNames.length - 1].textContent?.trim() || '';
        }
      }

      const calendarBtn = document.createElement('button');
      calendarBtn.className = 'add-to-calendar-btn';
      calendarBtn.title = 'Adicionar ao Google Agenda';
      calendarBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
          <path d="M12 14v4"></path>
          <path d="M10 16h4"></path>
        </svg>
      `;
      
      // Apply sleek, circular icon-button styles
      Object.assign(calendarBtn.style, {
        marginLeft: '12px',
        width: '40px',
        height: '40px',
        backgroundColor: '#f3f4f6',
        color: '#374151',
        border: '1px solid #e5e7eb',
        borderRadius: '50%',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        padding: '0'
      });

      calendarBtn.onmouseover = () => { 
        calendarBtn.style.backgroundColor = '#4A90E2'; 
        calendarBtn.style.color = 'white';
        calendarBtn.style.borderColor = '#4A90E2';
        calendarBtn.style.transform = 'translateY(-1px)';
        calendarBtn.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
      };
      calendarBtn.onmouseout = () => { 
        calendarBtn.style.backgroundColor = '#f3f4f6'; 
        calendarBtn.style.color = '#374151';
        calendarBtn.style.borderColor = '#e5e7eb';
        calendarBtn.style.transform = 'translateY(0)';
        calendarBtn.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
      };

      calendarBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const eventTitle = `Fluency: ${title}`;
        const eventDesc = `Sessão de conversação na Fluency Academy\nProfessor(a): ${teacher}\nLink: https://academy.fluency.io/`;
        const link = createCalendarLink(eventTitle, dateStr, eventDesc);
        if (link) window.open(link, '_blank');
      };

      container.appendChild(calendarBtn);
    }
  });
};

// Use MutationObserver to handle dynamic content loading
const observer = new MutationObserver(() => {
  addCalendarButtons();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Initial run
addCalendarButtons();
