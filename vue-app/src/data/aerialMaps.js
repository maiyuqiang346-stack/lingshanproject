export const aerialPreviewMap = {
  '九龙灌浴': { img: 'web/九龙灌浴2.jpg', target: '龙息' },
  '三王殿': { img: 'web/三王殿-b79e20d6fdbe.jpg', target: '三圣殿10' },
  '三王殿2': { img: 'web/三王殿-b79e20d6fdbe.jpg', target: '三圣殿10' },
  '五坛印城': { img: 'web/dji_20260506125424_0553_d.jpg', noTarget: true }
};

export function buildSceneToLabel(scenes) {
  const sceneToLabel = {};
  const aerialIdx = scenes.findIndex(img => img.n === '航拍0563');
  if (aerialIdx !== -1 && scenes[aerialIdx].labels) {
    scenes[aerialIdx].labels.forEach(lbl => {
      if (lbl.scenes) {
        lbl.scenes.forEach(sceneName => {
          sceneToLabel[sceneName] = { name: lbl.name, num: lbl.num, lon: lbl.lon, lat: lbl.lat };
        });
      }
    });
  }
  return sceneToLabel;
}
