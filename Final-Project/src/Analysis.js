import React from 'react';
import './Analysis.css';
import { Link } from 'react-router-dom';

function Analysis() {
  return (
    <html>
      <head>
        <title>My Page</title>
      </head>

      <h2>Analysis</h2>

      
      <body>
        <section id="analysis">
          <analysish>Hypothesis 1</analysish>
        </section>
        <analysisp>Hypo: During summer vacation [MONTH=Jul, Aug], a significant number of buses [VehicleClass=5, 6] travel to the Nature Preserve, suggesting that schools may choose this location for student tours and activities. This is likely because schools schedule these events during vacation periods when students have more free time, and the Nature Preserve offers an ideal setting for educational and recreational activities.<br/><br/>
        Result: False. According to the Bar Chart 1, for Car-type 1, 2 and 3, it is true that the number of vehicles in July and August is higher than in other months, but for the buses in our hypothesis, the number of vehicles in May is greater than in other months.<br></br><br/><br/>
        Default Value: Year: all; Car-Type: 5/6<br></br><br></br>
        <Link to="/Bar1">Bar Chart 1: Number of Vehicles in Different Months, with drop down to select year and car-type</Link>
        </analysisp>
        
        <section id="analysis">
          <analysish>Hypothesis 2</analysish>
        </section>
        <analysisp>Hypo: Buses (Car-type = 5, 6) do not stay in the nature preserve for a long time as their true destination is not the preserve, and the preserve is just a stopover on their journey.<br/><br/>
        Result: True. Based on the data from Bar Chart 3, where we focused on car-types 5 and 6, we can see that all vehicles stayed for a duration of 0-3 hours. This confirms our hypothesis.<br></br><br/><br/>
        Default Value: Car-Type: 5/6<br></br><br></br>
        <Link to="/Bar5">Bar Chart 3: Number of vehicles remain staying in the park for different times, with drop down to select year and car-type</Link>
        </analysisp>
        
        <section id="analysis">
          <analysish>Hypothesis 3</analysish>
        </section>
        <analysisp>Hypo: A significant number of passenger vehicles enter the Nature Preserve on weekends [Day=Saturday, Sunday] compared to weekdays [Day=Monday, Tuesday, Wednesday, Thursday, Friday], indicating a higher preference for leisurely activities such as sightseeing in natural settings during weekends. The month observed is constrained between July to September [MONTH=Jul, Aug, Sep], because the number of visitors are relatively more so the observation is more clear. This pattern may be attributed to the fact that the tours of the preserve tend to be longer and require more time than a typical workday would allow, making weekends a more suitable option for individuals seeking a more enjoyable and relaxed experience.<br/><br/>
        Result: True. According to the Calendar Heat Map, if we limit the car-type to 1/2/3, it is obvious that the traffic volume on Saturday, Sunday and even the following Monday is greater than other days. While other work vehicles (car-type: 2p/4/5/6) do not have this trend, which indicates a higher preference for leisurely activities such as sightseeing in natural settings during weekends.
<br></br><br/><br/>
        Default Value: Car-Type: 1/2/3<br></br><br></br>
        <Link to="/Bar3">Heat Map 1: Calendar Heat Map showing number of vehicles on different days, with drop down to select car-type and highlight holidays</Link>
        </analysisp>
        
        <section id="analysis">
          <analysish>Hypothesis 4</analysish>
        </section>
        <analysisp>Hypo: A truck [VehicleClass=2, 2p, 3, 4]  travels to ranger-stops [Gate-name=Ranger-stops] represents an emergency event in the nature reserve, like forest fire. This is because, according to the rules, only rangers’ cars can travel between ranger-stops. Trucks traveling between ranger-stops are then unusual patterns, suggesting unusual events.
<br/><br/>
        Result: False. According to the Bar Chart 2 and Heat Map 2, we can see that a significant number of cars of all types go through ranger-stops, meaning that this is not an unusual pattern. However, except for the 2p type cars which are distributed in all ranger-stops, almost all other types of cars are concentrated in ranger-stops 0 and 2, which may imply another uncommon pattern, that is, there are non-working cars passing through these two locations in violation of the rules.
<br></br><br/><br/>
        Default Value: Bar Chart 2--Gate: Ranger-stops<br></br><br></br>
        <Link to="/Bar2">Bar Chart 2: Number of Vehicles in Different Sensors, with drop down to select year, car-type and sensor</Link>
        <br></br><br></br>
        <Link to="/Bar4">Heat Map 2: Heat Map showing number of vehicles at different sensors, with drop down to select car-type</Link>
        </analysisp>
        
        <section id="analysis">
          <analysish>Hypothesis 5</analysish>
        </section>
        <analysisp>Hypo: Trucks of the park [VehicleClass=2p] appearing near the campgrounds [GateName=Camping] might be cleaning out the campgrounds and collecting the garbage left by tourists. Since not every tourist will completely clean out the garbage they produced, the preserve might have one or two trucks traveling between campgrounds daily to clean out garbage.
<br/><br/>
        Result: True. According to the Heat Map 2 and Bar Chart 2, it does exist that the number of 2p type cars in camping is smaller than other locations, with an average of about one 2p model per day passing through each camp, meaning that it is indeed possible that they are cleaning up trash. Also, the higher number of 2p models passing through camping 8 than other camping locations may imply an unusual pattern.
<br></br><br/><br/>
        Default Value: Bar Chart 2--Gate: Camping ; Car-Type: 2p<br></br><br></br>
        <Link to="/Bar2">Bar Chart 2: Number of Vehicles in Different Sensors, with drop down to select year, car-type and sensor</Link>
        <br></br><br></br>
        <Link to="/Bar4">Heat Map 2: Heat Map showing number of vehicles at different sensors, with drop down to select car-type</Link>
        </analysisp>
        
        <section id="analysis">
          <analysish>Hypothesis 6</analysish>
        </section>
        <analysisp>Hypo: The number of cars entering the Nature Preserve will be higher during holiday periods, such as Christmas and Thanksgiving, as people may have more free time during these periods and may be more inclined to engage in outdoor leisure activities. i.e. [MONTH=Dec, Date=23, 24, 25, 26…]
<br/><br/>
        Result: False. According to the Heat Map 1, it does not exist that the number of cars entering the Nature Preserve is higher during holiday periods, such as Christmas and Thanksgiving. It is clear that the season is much more influential than the festival, especially when it is mainly located in winter (Thanksgiving, Christmas).
<br></br><br/><br/>
        Default Value: Show Holiday Highlights<br></br><br></br>
        <Link to="/Bar3">Heat Map 1: Calendar Heat Map showing number of vehicles on different days, with drop down to select car-type and highlight holidays</Link>
        </analysisp>
        
        <section id="analysis">
          <analysish>Hypothesis 7</analysish>
        </section>
        <analysisp>Hypo: The differences in the number of cars entering the Nature Preserve through different gates may be indicative of the accessibility and attractiveness of each gate to visitors. [GateName=General-gates, Ranger-stops, Entrances, Camping, Gates] Specifically, we predict that gates with higher values may be located closer to popular attractions or have more convenient access to parking facilities, making them more attractive to visitors.
<br/><br/>
        Result: True. According to the Heat Map 2, there are more vehicles near the top part of the map than at the bottom part of the map, especially for visitor vehicles such as Car-type 1 or 2. This may indicate that the areas that are more attractive to tourists are mainly located at the top of the map.
<br></br><br/><br/>
        Default Value: Car-Type: all/1/2<br></br><br></br>
        <Link to="/Bar4">Heat Map 2: Heat Map showing number of vehicles at different sensors, with drop down to select car-type</Link>
        </analysisp>
        
        <section id="analysis">
          <analysish>Hypothesis 8</analysish>
        </section>
        <analysisp>Hypo: There are more heavy trucks [VehicleClass=3, 4] in winter [MONTH=Dec, Jan, Feb] than at other times of the year. This is likely due to the fact that these types of vehicles are often associated with extensive construction activities that may require much time and suitable environmental conditions to complete. In winter, the construction activities are free from the heat. Furthermore, the reserve may require extensive constructions to be operated during off-season of tourism to minimize the impact on visitors, given that there are fewer visitors during these times.
<br/><br/>
        Result: False. According to the Bar Chart 1, the number of vehicles is significantly higher in summer than in winter. Only the 2p type is less affected by the season and shows a more balanced distribution. The 2p type is more reflective of work vehicles, i.e., work vehicles are not concentrated in summer trips like tourists.
<br></br><br/><br/>
        Default Value: Car-Type: all/3/4/2p<br></br><br></br>
        <Link to="/Bar1">Bar Chart 1: Number of Vehicles in Different Months, with drop down to select year and car-type</Link>
        </analysisp>
        
        <section id="analysis">
          <analysish>Hypothesis 9</analysish>
        </section>
        <analysisp>Hypo: Some commercial vehicles remain parked at the Nature Preserve for more than 6 hours indicating there may be food vendors operating inside the preserve. Commercial vehicles are selected by [VehicleClass=2, 2p] because commercial vehicles will generally be in the type of 2 axle truck. This could be due to visitors spending additional time exploring the preserve and engaging in activities that require more than one day to complete, such as hiking or camping, and therefore requiring access to food.
<br/><br/>
        Result: True. According to the Bar Chart 3, there are indeed vehicles that stay for more than 6 hours and even a significant number of vehicles that stay for more than 36 hours. All 2p type cars never left the campus, probably due to their being work vehicles. Whereas the larger vehicles (Car-type=4/5/6) never stay in the park for more than 3 hours.
<br></br><br/><br/>
        Default Value: Car-Type: 2/2p/4/5/6<br></br><br></br>
        <Link to="/Bar5">Bar Chart 3: Number of vehicles remain staying in the park for different times, with drop down to select year and car-type</Link>
        </analysisp>
        
        <section id="analysis">
          <analysish>Hypothesis 10</analysish>
        </section>
        <analysisp>Hypo: The number of work vehicles in the park (Car-type=2p) is less affected by seasonal factors. Because of the use of work vehicles, it does not fluctuate as much as the number of visitor vehicles due to human factors.
<br/><br/>
        Result: True. According to the Heat Map 1, the number of 2p type of vehicles in the park fluctuates less throughout the year, and conversely the number of visitor vehicles (Car-type=1/2/3) is clearly higher in the summer.
<br></br><br/><br/>
        Default Value: Car-Type: 2p/1/2/3<br></br><br></br>
        <Link to="/Bar3">Heat Map 1: Calendar Heat Map showing number of vehicles on different days, with drop down to select car-type and highlight holidays</Link>
        </analysisp>

        <br></br><br/><br/><br></br><br/><br/>

    
        
      </body>
    </html>
  );
}

export default Analysis;