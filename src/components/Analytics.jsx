import { useState, useEffect } from "react";
import Section from "./Section";
import { BackgroundCircles } from "./design/Hero";
import Button from "./Button";

const Analytics = () => {
  const [currentVisits, setCurrentVisits] = useState(0);
  const [visitDurations, setVisitDurations] = useState({});
  const [completedEvents, setCompletedEvents] = useState({});

  const exportToCSV = (data, filename) => {
    // Convert data to CSV string
    let csvContent = '';
    
    if (filename === 'visit-durations.csv') {
      csvContent = 'ID,Duration(seconds)\n';
      Object.entries(data).forEach(([id, duration]) => {
        csvContent += `${id},${duration.toFixed(2)}\n`;
      });
    } else if (filename === 'completed-events.csv') {
      csvContent = 'ID,Event Count,Event Durations\n';
      Object.entries(data).forEach(([id, events]) => {
        csvContent += `${id},${events.length},"${events.map(d => d.toFixed(2)).join(', ')}"\n`;
      });
    }

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current visits
        const visitsResponse = await fetch("http://127.0.0.1:8000/model/currentvisits");
        const visitsData = await visitsResponse.json();
        setCurrentVisits(visitsData.current_visits);

        // Fetch visit durations
        const durationsResponse = await fetch("http://127.0.0.1:8000/model/visitduration");
        const durationsData = await durationsResponse.json();
        setVisitDurations(durationsData);

        // Fetch completed events
        const eventsResponse = await fetch("http://127.0.0.1:8000/model/completedevents");
        const eventsData = await eventsResponse.json();
        setCompletedEvents(eventsData);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Section
      className="pt-[8rem] pb-[2rem] -mt-[1.25rem]"
      crosses
      crossesOffset="lg:translate-y-[2rem]"
      customPaddings
    >
      <div className="container relative">
        <h1 className="h1 mb-6 lg:mb-10 text-center">Analytics Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Current Visits Card */}
          <div className="relative p-0.5 rounded-2xl bg-conic-gradient">
            <div className="relative bg-n-8 rounded-[1rem] p-8 h-full">
              <h3 className="h4 mb-4">Active Visitors</h3>
              <p className="body-1 text-primary-1 mb-4">{currentVisits}</p>
              <p className="body-2 text-n-4">Currently being tracked in real-time</p>
            </div>
          </div>

          {/* Visit Durations Card */}
          <div className="relative p-0.5 rounded-2xl bg-conic-gradient">            <div className="relative bg-n-8 rounded-[1rem] p-8 h-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="h4">Visit Durations</h3>
                <Button 
                  className="text-sm px-4 py-2" 
                  onClick={() => exportToCSV(visitDurations, 'visit-durations.csv')}
                >
                  Export CSV
                </Button>
              </div>
              <div className="space-y-4">
                {Object.entries(visitDurations).map(([id, duration]) => (
                  <div key={id} className="flex justify-between items-center">
                    <span className="body-2 text-n-4">ID {id}</span>
                    <span className="body-2 text-primary-1">{duration.toFixed(2)}s</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Completed Events Card */}
          <div className="relative p-0.5 rounded-2xl bg-conic-gradient">            <div className="relative bg-n-8 rounded-[1rem] p-8 h-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="h4">Completed Events</h3>
                <Button 
                  className="text-sm px-4 py-2" 
                  onClick={() => exportToCSV(completedEvents, 'completed-events.csv')}
                >
                  Export CSV
                </Button>
              </div>
              <div className="space-y-4">
                {Object.entries(completedEvents).map(([id, events]) => (
                  <div key={id} className="flex justify-between items-center">
                    <span className="body-2 text-n-4">ID {id}</span>
                    <span className="body-2 text-primary-1">{events.length} events</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <BackgroundCircles />
    </Section>
  );
};

export default Analytics;
