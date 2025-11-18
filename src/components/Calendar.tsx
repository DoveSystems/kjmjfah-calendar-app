import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, addMonths, subMonths, isToday, startOfWeek, endOfWeek } from 'date-fns';
import { useStore } from '../store/useStore';
import { Calendar as CalendarIcon, Download } from 'lucide-react';
import TimeOffDialog from './TimeOffDialog';
import jsPDF from 'jspdf';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showTimeOffDialog, setShowTimeOffDialog] = useState(false);
  const { timeOffs, users, getSprintForDate } = useStore();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTimeOffsForDate = (date: Date) => {
    return timeOffs.filter((to) => {
      const start = new Date(to.startDate);
      const end = new Date(to.endDate);
      return date >= start && date <= end;
    });
  };

  const getSprintInfo = (date: Date) => {
    const sprint = getSprintForDate(date);
    return sprint;
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowTimeOffDialog(true);
  };

  const exportToPDF = () => {
    const doc = new jsPDF('landscape', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);
    const contentHeight = pageHeight - (margin * 2);

    // Title
    doc.setFontSize(24);
    doc.setTextColor(99, 102, 241); // indigo-600
    doc.text('KJMJFAH Team Calendar', margin, margin + 10);
    
    // Month and Year
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text(format(currentMonth, 'MMMM yyyy'), margin, margin + 20);

    // Team Members List
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    let yPos = margin + 30;
    doc.setFont(undefined, 'bold');
    doc.text('Team Members:', margin, yPos);
    yPos += 7;
    doc.setFont(undefined, 'normal');
    
    users.forEach((user, index) => {
      if (yPos > pageHeight - 50) {
        doc.addPage();
        yPos = margin + 10;
      }
      doc.text(`${index + 1}. ${user.name} (${user.team}) - ${user.country}, ${user.location}`, margin + 5, yPos);
      yPos += 6;
    });

    // Calendar Grid
    const weekStart = startOfWeek(monthStart);
    const weekEnd = endOfWeek(monthEnd);
    const allDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
    
    const cellWidth = contentWidth / 7;
    const cellHeight = 20;
    const calendarStartY = yPos + 10;
    
    // Day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    doc.setFont(undefined, 'bold');
    doc.setFontSize(10);
    dayHeaders.forEach((day, index) => {
      const xPos = margin + (index * cellWidth) + (cellWidth / 2);
      doc.text(day, xPos, calendarStartY, { align: 'center' });
    });

    // Calendar grid
    doc.setFont(undefined, 'normal');
    doc.setFontSize(8);
    let currentY = calendarStartY + 8;
    
    allDays.forEach((day, index) => {
      const weekIndex = Math.floor(index / 7);
      const dayIndex = index % 7;
      const xPos = margin + (dayIndex * cellWidth);
      const yPos = calendarStartY + 10 + (weekIndex * cellHeight);
      
      if (yPos + cellHeight > pageHeight - margin) {
        doc.addPage();
        currentY = margin + 10;
      }
      
      const isCurrentMonthDay = isSameMonth(day, currentMonth);
      const dayTimeOffs = getTimeOffsForDate(day);
      const sprint = getSprintInfo(day);
      
      // Draw cell border
      doc.setDrawColor(200, 200, 200);
      doc.rect(xPos, yPos - 5, cellWidth, cellHeight);
      
      // Day number
      doc.setFont(undefined, isToday(day) ? 'bold' : 'normal');
      doc.setTextColor(isCurrentMonthDay ? 0 : 150);
      doc.text(format(day, 'd'), xPos + 2, yPos);
      
      // Sprint info
      if (sprint && isCurrentMonthDay) {
        doc.setFontSize(7);
        doc.setTextColor(139, 92, 246); // purple-500
        doc.text(`S${sprint.number}`, xPos + 2, yPos + 5);
        doc.setFontSize(8);
      }
      
      // Time-off entries
      if (dayTimeOffs.length > 0 && isCurrentMonthDay) {
        doc.setFontSize(6);
        dayTimeOffs.slice(0, 2).forEach((to, i) => {
          const user = users.find((u) => u.id === to.userId);
          if (user) {
            doc.setTextColor(251, 146, 60); // orange-400
            const text = `${user.name.substring(0, 8)}`;
            doc.text(text, xPos + 2, yPos + 8 + (i * 4));
          }
        });
        if (dayTimeOffs.length > 2) {
          doc.setTextColor(100, 100, 100);
          doc.text(`+${dayTimeOffs.length - 2}`, xPos + 2, yPos + 16);
        }
        doc.setFontSize(8);
      }
      
      doc.setTextColor(0, 0, 0);
    });

    // Time-off Summary
    const summaryY = calendarStartY + (Math.ceil(allDays.length / 7) * cellHeight) + 15;
    if (summaryY < pageHeight - 40) {
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('Time-Off Summary:', margin, summaryY);
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      let summaryYPos = summaryY + 8;
      
      timeOffs
        .filter(to => {
          const start = new Date(to.startDate);
          const end = new Date(to.endDate);
          return (start >= monthStart && start <= monthEnd) || (end >= monthStart && end <= monthEnd) || (start <= monthStart && end >= monthEnd);
        })
        .forEach((to) => {
          if (summaryYPos > pageHeight - margin) {
            doc.addPage();
            summaryYPos = margin + 10;
          }
          const user = users.find((u) => u.id === to.userId);
          const startDate = format(new Date(to.startDate), 'MMM d');
          const endDate = format(new Date(to.endDate), 'MMM d, yyyy');
          doc.text(`${user?.name || 'Unknown'}: ${startDate} - ${endDate} (${to.reason})`, margin + 5, summaryYPos);
          summaryYPos += 6;
        });
    }

    // Footer
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${i} of ${totalPages} | Generated on ${format(new Date(), 'MMM d, yyyy')}`,
        pageWidth / 2,
        pageHeight - 5,
        { align: 'center' }
      );
    }

    // Save PDF
    const fileName = `KJMJFAH-Calendar-${format(currentMonth, 'MMMM-yyyy')}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="premium-card">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Calendar</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">View and manage time-off</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all font-medium shadow-sm"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-4 py-2 premium-button text-sm"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all font-medium shadow-sm"
          >
            Next
          </button>
          <button
            onClick={exportToPDF}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all font-semibold shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center font-bold text-gray-700 dark:text-gray-300 py-3 text-sm uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {daysInMonth.map((day) => {
          const dayTimeOffs = getTimeOffsForDate(day);
          const sprint = getSprintInfo(day);
          const isCurrentDay = isToday(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);

          return (
            <div
              key={day.toString()}
              onClick={() => handleDateClick(day)}
              className={`
                min-h-[120px] p-3 rounded-xl border-2 cursor-pointer transition-all
                ${isCurrentDay 
                  ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 shadow-lg' 
                  : 'border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50'}
                ${!isCurrentMonth ? 'opacity-40' : ''}
                hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg hover:scale-[1.02]
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-base font-bold ${isCurrentDay ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-800 dark:text-gray-200'}`}>
                  {format(day, 'd')}
                </span>
                {sprint && (
                  <span className="text-xs bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-2 py-1 rounded-lg font-semibold shadow-sm">
                    S{sprint.number}
                  </span>
                )}
              </div>
              <div className="space-y-1.5">
                {dayTimeOffs.slice(0, 2).map((to) => {
                  const user = users.find((u) => u.id === to.userId);
                  return (
                    <div
                      key={to.id}
                      className="text-xs bg-gradient-to-r from-orange-400 to-pink-400 text-white px-2 py-1 rounded-lg truncate font-medium shadow-sm"
                      title={`${user?.name}: ${to.reason}`}
                    >
                      {user?.name} 🏖️
                    </div>
                  );
                })}
                {dayTimeOffs.length > 2 && (
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    +{dayTimeOffs.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showTimeOffDialog && selectedDate && (
        <TimeOffDialog
          date={selectedDate}
          onClose={() => {
            setShowTimeOffDialog(false);
            setSelectedDate(null);
          }}
        />
      )}
    </div>
  );
};

export default Calendar;

