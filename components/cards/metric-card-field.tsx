import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Metrics } from '@/models/statistics/common-metrics';
import { StatEntity } from '@/models/statistics/stat-entity';

export default function MetricCardField<T extends Metrics>({
  metric
}: {
  metric: StatEntity<T>;
}) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>{metric.name}</AccordionTrigger>
        <AccordionContent>
          <ul className="list-disc pl-4 space-y-2">
            {Object.entries(metric.value)
              .filter(
                ([key, _]) =>
                  key !== 'fieldsMapping' && key !== 'fieldsDisplayNames'
              )
              .map(([key, value]) => (
                  <li key={key}>
                    <div className="flex flex-row gap-1">
                      <p className="text-sm">{value.name}:</p>{' '}
                      <p className="text-sm">{value.value}</p>
                    </div>
                  </li>
                ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
