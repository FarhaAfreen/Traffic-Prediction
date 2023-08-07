import json
import math
import heapq
from geopy.geocoders import Nominatim
import copy

MAX_VAL = float("inf")

global ROAD_NETWORK

COMPLETE_COORDINATE_LIST = dict()

DAYS_MAPPING = {
    'Sunday': 0,
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
    'Saturday': 6
}


def time_to_integer(time):
    hour, minute = map(int, time.split(':'))
    total_minutes = hour * 60 + minute
    return round(total_minutes / 15) % 96


with open(r'dataSet\NNetworkData.json') as NETWORK_DATA_FILE:
    NETWORK_DATA = json.load(NETWORK_DATA_FILE)

with open(r'dataSet\NTrafficPatternData.json') as TRAFFIC_DATA_FILE:
    TRAFFIC_DATA = json.load(TRAFFIC_DATA_FILE)

with open(r'dataSet\TrafficPatternTable.json') as TRAFFIC_PATTERN_FILE:
    PATTERN_DATA_LIST = json.load(TRAFFIC_PATTERN_FILE)

COMPLETE_PATTERN_LIST = []
PATTERN_DATA = dict()

for node in PATTERN_DATA_LIST:
    pattern_id = node["PATTERN_ID"]
    speed_val = node["SPEED_VALUES"]
    PATTERN_DATA[pattern_id] = speed_val
    COMPLETE_PATTERN_LIST.append(pattern_id)

COMPLETE_PATTERN_LIST.sort(key=lambda x: int(x))


# adjusting network data appropriately
# all neighbor link, lat and long format
for link, data in NETWORK_DATA.items():

    new = data["REF_NODE_NEIGHBOR_LINKS"].split(',')
    new_non = data["NONREF_NODE_NEIGHBOR_LINKS"].split(',')
    all_nodes = new + new_non

    data["ALL_NEIGHBOR_LINKS"] = [str(abs(int(cur_node))) for cur_node in all_nodes if cur_node!='']

    latitude = int(NETWORK_DATA[link]["LAT"].split(',')[0])
    longitude = int(NETWORK_DATA[link]["LON"].split(',')[0])
    latitude = latitude*0.00001
    longitude = longitude*0.00001
    latitude = round(latitude, 5)
    longitude = round(longitude, 5)
    data["LAT"] = latitude
    data["LON"] = longitude

    COMPLETE_COORDINATE_LIST[(data["LAT"], data["LON"])] = link

for link, data in TRAFFIC_DATA.items():
    final_val = data["T_WEEKDAY"]
    if data["T_WEEKDAY"] == None:
        final_val = data["F_WEEKDAY"]
    if data["F_WEEKDAY"] == None:
        final_val = 0
    data["DAY"] = final_val if final_val!=0 else '1907,1907,1907,1907,1907,1907,1907'



def findClosestPattern(value):
    for i in COMPLETE_PATTERN_LIST:
        if int(i) >= int(value):
            return i
    
def haversineDistance(lat1, lon1, lat2, lon2):
    R = 6371  # Earth's radius in kilometers

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2) * math.sin(dlat/2) + math.cos(math.radians(lat1)) \
        * math.cos(math.radians(lat2)) * math.sin(dlon/2) * math.sin(dlon/2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    distance = R * c

    return distance

def findClosestPlace(latitude, longitude):
    min_distance = float('inf')
    closest_place_id = None

    for coords, place in COMPLETE_COORDINATE_LIST.items():
        # print(place)
        place_lat, place_lon = coords
        distance = haversineDistance(latitude, longitude, place_lat, place_lon)
        if distance < min_distance:
            min_distance = distance
            closest_place_id = place

    return closest_place_id


def heuristic(node, goal):

    lat1 = NETWORK_DATA[node]["LAT"]
    lon1 = NETWORK_DATA[node]["LON"]
    lat2 = NETWORK_DATA[goal]["LAT"]
    lon2 = NETWORK_DATA[goal]["LON"]

    return haversineDistance(lat1, lon1, lat2, lon2)**2/100

def path(start, goal, day, time):

    open_set = [(0, start)]  # Priority queue of nodes to explore, ordered by total cost
    came_from = {}  # Dictionary to track the previous node in the optimal path

    g_score = {node: MAX_VAL for node in NETWORK_DATA}  # Cost from start to each node
    g_score[start] = 0

    f_score = {node: MAX_VAL for node in NETWORK_DATA}  # Estimated total cost from start to goal through each node
    f_score[start] = heuristic(start, goal)

    while open_set:
        _, current = heapq.heappop(open_set)

        if current == goal:
            return reconstruct_path(came_from, goal)

        for neighbor in NETWORK_DATA[current]["ALL_NEIGHBOR_LINKS"]:
            if neighbor != '' and neighbor in NETWORK_DATA:
                link = float(NETWORK_DATA[neighbor]['LINK_LENGTH'])
                speed = TRAFFIC_DATA[neighbor]["DAY"].split(',')
                list_speed = PATTERN_DATA[findClosestPattern(speed[DAYS_MAPPING[day]])].split(',')
                final_data = link * link * float(NETWORK_DATA[neighbor]['LINK_LENGTH']) / (int(list_speed[time_to_integer(time)]))
                tentative_g_score = g_score[current] + final_data

                if tentative_g_score < g_score[neighbor]:
                    came_from[neighbor] = current
                    g_score[neighbor] = tentative_g_score
                    f_score[neighbor] = g_score[neighbor] + heuristic(neighbor, goal)
                    heapq.heappush(open_set, (f_score[neighbor], neighbor))
    return None 

def reconstruct_path(came_from, current):
    path = [current]
    while current in came_from:
        current = came_from[current]
        path.append(current)
    path.reverse()
    return path

def traffic_indicator(value):
    #  0 - RED
    #  1 - YELLOW
    #  2 - GREEN
    if value < 0.2:
        return '#EB455F'
    elif value < 0.5:
        return '#F9D949'
    return '#03C988'



FEATURE_TEMPLATE = {

    'type': 'Feature',
    'properties': {
        'color': 'INSERT_REQUIRED_COLOR_HERE'
    },
    'geometry': {
        'type': 'LineString',
        'coordinates': 'INSERT_COORDINATE_LIST_HERE'    
    }

}


def createFeatures(coordinates, colorCodes):
    length = len(coordinates) - 1
    start = coordinates[0]
    end = coordinates[-1]
    middle = [(start[0]+end[0])/2, (start[1]+end[1])/2]
    featureList = []
    current_node = 0
    while current_node < length:
        feature = copy.deepcopy(FEATURE_TEMPLATE)
        coordinate_list = [coordinates[current_node], coordinates[current_node+1]]
        color = colorCodes[current_node]
        current_node += 1
        feature['properties']['color'] = color
        feature['geometry']['coordinates'] = coordinate_list
        featureList.append(feature)

    return [featureList, middle, start, end]


def process_data(data):

    source = data[0]
    destination = data[1]
    day = data[2]
    time = data[3]

    # print('the details are ', source, destination)
    geolocator = Nominatim(user_agent="MyApp")
    

    S = geolocator.geocode(source,timeout=10000)
    Slat, Slon = S.latitude, S.longitude
    # print('for S', Slat, Slon)

    D = geolocator.geocode(destination,timeout=10000)
    Dlat, Dlon = D.latitude, D.longitude   
    # print('D', Dlat, Dlon)

    ModifiedSource, ModifiedDestination = findClosestPlace(Slat, Slon), findClosestPlace(Dlat, Dlon)
    # print(ModifiedSource, ModifiedDestination)

    coordinateList = path(ModifiedSource, ModifiedDestination, day, time)

    modifiedList = []
    traffic_density = []
    total_length = 0
    total_time = 0
    average_speed = 0
    actual_time = 0

    
    for node in coordinateList:

        # creating the response
        modifiedList.append([round(NETWORK_DATA[node]["LON"], 5), round(NETWORK_DATA[node]["LAT"], 5)])
        length = NETWORK_DATA[node]["LINK_LENGTH"]
        speed = TRAFFIC_DATA[node]["DAY"].split(',')
        SPEED = float(PATTERN_DATA[findClosestPattern(speed[DAYS_MAPPING[day]])].split(',')[time_to_integer(time)])
        required_value = SPEED/float(TRAFFIC_DATA[node]['FREE_FLOW_SPEED'])
        traffic_density.append(traffic_indicator(required_value))



        length_km = float(length)/1000
        actual_time += length_km/SPEED
        # calculating summary details
        total_length += float(length)
        print(total_length)
        total_time += float(length)/SPEED
        average_speed += SPEED

    total_time = int(total_time)
    actual_time = round(actual_time, 2)
    total_length = int(total_length//1000)
    # total length ik kilometers
    average_speed = int(float(average_speed) / len(coordinateList))
    speed = round(total_length/actual_time, 3)
    # print('the details are ', total_length, total_time, average_speed)
    return_value =  createFeatures(modifiedList, traffic_density)
    # print('what is going on ', return_value)
    total_time = str(total_time)
    actual_time = str(actual_time)
    total_length = str(total_length)
    average_speed = str(average_speed)
    speed = str(speed)

    # actual_time = actual_time.zfill(3)
    total_length = total_length.zfill(3)
    average_speed = average_speed.zfill(3)
    

    return_value.append(actual_time)
    return_value.append(total_length)
    return_value.append(speed)
    print(return_value)
    return return_value

# start_node = '714263571'
# goal_node = '715032831'
# path = path(start_node, goal_node, 'Sunday', '12:00')

# if path:
#     print("Shortest path:", )
#     print()
#     modifiedList = []
#     traffic_density = []

#     for node in path:
#         # print(i)
        
#         modifiedList.append([round(NETWORK_DATA[node]["LON"], 5), round(NETWORK_DATA[node]["LAT"], 5)])
#         length = NETWORK_DATA[node]["LINK_LENGTH"]
#         speed = TRAFFIC_DATA[node]["DAY"].split(',')
#         SPEED = float(PATTERN_DATA[findClosestPattern(speed[DAYS_MAPPING['Monday']])].split(',')[time_to_integer('12:12')])
#         required_value = SPEED/float(TRAFFIC_DATA[node]['FREE_FLOW_SPEED'])
#         traffic_density.append(traffic_indicator(required_value))

#     print(modifiedList)
#     print()
#     print(traffic_density)

        
# else:
#     print("No path found.")