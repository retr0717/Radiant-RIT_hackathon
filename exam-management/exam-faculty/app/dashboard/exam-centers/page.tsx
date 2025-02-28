"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Check, MapPin, Users } from 'lucide-react';
import { getExamCenters } from '@/lib/actions/centers';  

export default function ExamCentersPage() {
  const [examCenters, setExamCenters] = useState([]);
  const [selectedCenters, setSelectedCenters] = useState<number[]>([]);
  const { toast } = useToast();

  const handleSelectCenter = (centerId: number) => {
    if (selectedCenters.includes(centerId)) {
      setSelectedCenters(selectedCenters.filter(id => id !== centerId));
    } else {
      setSelectedCenters([...selectedCenters, centerId]);
    }
  };
  
  useEffect(() => {
    const fetchCenters = async () => {
      const {data} = await getExamCenters();
      console.log("centers : ", data);
      setExamCenters(data);
    }
    fetchCenters();
  }, [])

  const handleConfirmSelection = () => {
    if (selectedCenters.length === 0) {
      toast({
        variant: "destructive",
        title: "No centers selected",
        description: "Please select at least one exam center.",
      });
      return;
    }

    toast({
      title: "Centers selected successfully",
      description: `You have selected ${selectedCenters.length} exam centers.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Exam Centers</h1>
          <p className="text-muted-foreground">Select your preferred exam centers for proctoring</p>
        </div>
        <Button 
          onClick={handleConfirmSelection}
          disabled={selectedCenters.length === 0}
          className="flex items-center gap-2"
        >
          <Check className="h-4 w-4" />
          Confirm Selection ({selectedCenters.length})
        </Button>
      </div>

      <Tabs defaultValue="grid">
        <TabsList className="mb-4">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="grid" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {examCenters.map((center) => (
              <Card 
                key={center.id} 
                className={`overflow-hidden transition-all ${
                  selectedCenters.includes(center.id) 
                    ? 'ring-2 ring-primary' 
                    : ''
                }`}
              >
                <div 
                  className="h-48 bg-cover bg-center" 
                  style={{ backgroundImage: `url(https://images.unsplash.com/photo-1504439468489-c8920d796a29?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80)` }}
                />
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{center.name}</CardTitle>
                    <Badge variant={center.available > 50 ? "default" : "secondary"}>
                      {center.available} seats
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {center.room}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Capacity: {center.capacity}</span>
                    <span className="text-muted-foreground">•</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant={selectedCenters.includes(center.id) ? "default" : "outline"}
                    className="w-full"
                    onClick={() => handleSelectCenter(center.id)}
                  >
                    {selectedCenters.includes(center.id) ? "Selected" : "Select Center"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="map">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Map View</CardTitle>
              <CardDescription>
                View exam centers on a map to find the most convenient locations
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[500px] flex items-center justify-center bg-muted/30">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">Map view is currently in development</p>
                <p className="text-sm">Please use the grid view to select exam centers</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}