export const regexFE = /(?<date>\d{2}-\d{2})\s(?<timestamp>\d{2}:\d{2}:\d{2}.\d{3}).*(?<action>Passing event to registered event handler \(FE\)):\s(?<event>[^,]*),\sBundle\[{(?<params>.*)}\]/;

export const regexGA4 = /(?<date>\d{2}-\d{2})\s(?<timestamp>\d{2}:\d{2}:\d{2}.\d{3}).*:\s(?<action>Logging event: origin=app\+gtm),name=(?<event>[^,]*),params=Bundle\[{(?<params>.*)}\]/;

export const regexGAU = /(?<date>\d{2}-\d{2})\s(?<timestamp>\d{2}:\d{2}:\d{2}.\d{3}).*:\s(?<action>Hit delivery requested):\s(?<params>.*)/;

export const allItemsRegex = /items=\[(?<items>.*)\]/;