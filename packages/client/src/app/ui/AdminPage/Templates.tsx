import { useAmalgema } from "../../../useAmalgema";
import { Entity, Has, getComponentValueStrict } from "@latticexyz/recs";
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { Hex, hexToString } from "viem";
import { hexToResource } from "@latticexyz/common";
import { Button } from "../Theme/SkyStrife/Button";
import { SchemaToPrimitives } from "@latticexyz/store";

function StandardHero({ templateId }: { templateId: Entity }) {
  const {
    components: { HeroInRotation },
    network: { worldContract },
  } = useAmalgema();

  const value = useComponentValue(HeroInRotation, templateId);

  const inRotation = value && value.value;

  return (
    <td>
      <Button
        buttonType="secondary"
        onClick={() => worldContract.write.setHeroInRotation([templateId as Hex, !inRotation])}
        style={{ color: inRotation ? "green" : "darkred" }}
      >
        {inRotation ? "true" : "false"}
      </Button>
    </td>
  );
}

function SeasonPassHero({ templateId }: { templateId: Entity }) {
  const {
    components: { HeroInSeasonPassRotation },
    network: { worldContract },
  } = useAmalgema();

  const value = useComponentValue(HeroInSeasonPassRotation, templateId);

  const inRotation = value && value.value;

  return (
    <td>
      <Button
        buttonType="secondary"
        onClick={() => worldContract.write.setHeroInSeasonPassRotation([templateId as Hex, !inRotation])}
        style={{ color: inRotation ? "green" : "darkred" }}
      >
        {inRotation ? "true" : "false"}
      </Button>
    </td>
  );
}

export const Templates = () => {
  const {
    components: { TemplateTables },
    utils: { getTemplateValueStrict },
  } = useAmalgema();

  const templates = useEntityQuery([Has(TemplateTables)]).map((templateId) => {
    const { value: tableIds } = getComponentValueStrict(TemplateTables, templateId);

    const values: Record<string, SchemaToPrimitives<any>> = {};

    tableIds.forEach((tableId) => (values[tableId] = getTemplateValueStrict(tableId as Hex, templateId as Hex)));

    return {
      templateId,
      values: values,
    };
  });

  return (
    <div>
      <div className="flex flex-row">
        <div className="w-full text-3xl text-left p-1">Templates</div>
      </div>
      <table className="w-full text-lg text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xl text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th>ID</th>
            <th>Size</th>
            <th>Is standard hero?</th>
            <th>Is season pass hero?</th>
            <th>Components</th>
          </tr>
        </thead>
        <tbody>
          {templates.map(({ templateId, values }) => (
            <tr className="border-4" key={templateId}>
              <td>{hexToString(templateId as Hex)}</td>
              <td>{Object.keys(values).length}</td>
              <td>
                <StandardHero templateId={templateId} />
              </td>
              <td>
                <SeasonPassHero templateId={templateId} />
              </td>
              <td>
                {Object.entries(values).map(([tableId, value]) => (
                  <div key={tableId}>
                    <div key={tableId}>{hexToResource(tableId as Hex).name}</div>
                    <div>{JSON.stringify(value)}</div>
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
