# Admin Dashboard Enhancements Implementation Plan

## Features to Implement

### 1. Market Prices - Tabular Format with Pagination
- Display market prices in a table (8 items per page)
- Columns: Crop Name, Market, Location, LGA, Price, Unit, Last Updated, Actions
- Pagination controls at bottom

### 2. Price Details View
- Click on a price row to view detailed breakdown
- Show all prices for that crop across different markets/locations
- Inline editing capability for each market/location price
- Modal or side panel view

### 3. Dynamic Market/Location Management
- When updating prices, allow adding new markets
- When updating prices, allow adding new locations
- Dropdown with "Add New" option
- Input fields appear when "Add New" is selected

### 4. LGA-Market Relationship (Backend Changes Required)
- Create Market model with LGA relationship
- Create Location model with LGA relationship
- Update MarketPrice to reference Market and Location entities
- API endpoint to fetch markets by LGA
- API endpoint to fetch locations by LGA

### 5. Events - Optional Image
- Remove required validation for image field
- Allow event creation without image
- Display placeholder if no image provided

### 6. Overview Pie Chart
- Fetch real market price data
- Group by crop or market
- Display using Recharts PieChart
- Show top 5-7 crops by price volume

## Implementation Order

1. Backend: Create Market and Location models
2. Backend: Update MarketPrice relationships
3. Backend: Add endpoints for markets/locations by LGA
4. Frontend: Update AdminMarketPriceManager with table and pagination
5. Frontend: Add price details modal
6. Frontend: Implement dynamic market/location selection
7. Frontend: Make event image optional
8. Frontend: Add pie chart to admin overview

## Files to Create/Modify

### Backend
- `Market.java` (new model)
- `Location.java` (new model)
- `MarketRepository.java` (new)
- `LocationRepository.java` (new)
- `MarketPrice.java` (update relationships)
- `MarketPriceController.java` (add endpoints)

### Frontend
- `AdminMarketPriceManager.tsx` (major update)
- `PriceDetailsModal.tsx` (new component)
- `AdminEventManager.tsx` (make image optional)
- `admin/page.tsx` (add pie chart to overview)

Let's begin implementation...