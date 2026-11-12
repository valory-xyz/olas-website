import type { Forecast } from 'components/ModelsPage/OlasPredictR1/ExampleForecasts';
import { ExampleForecasts as ExampleForecastsBase } from 'components/ModelsPage/OlasPredictR1/ExampleForecasts';
import forecasts from 'data/olasPredictQwen27bForecasts.json';

export const ExampleForecasts = () => <ExampleForecastsBase forecasts={forecasts as Forecast[]} />;
