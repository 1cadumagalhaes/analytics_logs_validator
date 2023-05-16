import { depara, product_depara } from "./configs/depara.js";
import { regexFE, regexGA4, regexGAU, allItemsRegex } from "./configs/regex.js";

function translateGAUparam(param) {

  const promoRegex = /promo(?<number>\d)(?<dimension>[a-z]+)(?<index>\d)?/;
  const produtoRegex = /pr(?<number>\d)(?<dimension>[a-z]+)(?<index>\d)?/;
  const cdRegex = /cd(?<index>\d)/;

  const replace_promo = (...args) => {
    let { number, dimension, index } = args[args.length - 1];
    if (product_depara[dimension]) dimension = product_depara[dimension];
    else dimension = /cd/.test(dimension) ? "custom_dimension" : dimension;
    return `promotion_${number}_${dimension}${index ? "_" + index : ""}`
  };

  const replace_product = (...args) => {
    let { number, dimension, index } = args[args.length - 1];
    if (product_depara[dimension]) dimension = product_depara[dimension];
    else dimension = /cd/.test(dimension) ? "custom_dimension" : dimension;
    return `product_${number}_${dimension}${index ? "_" + index : ""}`
  };

  if (depara[param]) return depara[param];
  if (promoRegex.test(param)) {
    return param.replace(promoRegex, replace_promo);
  }
  if (produtoRegex.test(param)) {
    return param.replace(produtoRegex, replace_product);
  }
  if (cdRegex.test(param)) {
    return param.replace(cdRegex, "custom_dimension_$<index>")
  }
  return param;
}

function parseParams(params, gau = false) {
  let entries = params.split(", ").map(param => param.split("="));
  if (gau)
    entries = entries.map(([key, value]) => [translateGAUparam(key), value]);
  return Object.fromEntries(entries.filter(([key, value]) => key && value));
}




function parseItems(itemsString) {
  let itemRegex = /Bundle\[{([^\]]*)}\]?,/g
  let items = itemsString.match(itemRegex)?.map(function (item) {
    item = parseParams(item.match(/{(?<item>.*)}/)?.groups?.item)
    return item;
  });
  return items;
}

export function parseFirebase(line) {

  let { date, timestamp, action, event, params } = { ...line.match(regexFE)?.groups };
  console.log(params);

  let items = params?.match(allItemsRegex)?.groups?.items;
  if (params)
    params = parseParams(params?.replace(allItemsRegex, ""));
  if (items)
    items = parseItems(items);

  return { date, timestamp, action, event, params, items }
}

export function parseGA4(line) {

  let { date, timestamp, action, event, params } = { ...line.match(regexGA4)?.groups };
  let items = params.match(allItemsRegex)?.groups?.items;
  params = parseParams(params.replace(allItemsRegex, ""));
  if (items)
    items = parseItems(items);

  return { date, timestamp, action, event, params, items }
}
export function parseGAU(line) {

  let { date, timestamp, action, event, params } = { ...line.match(regexGAU)?.groups };
  params = parseParams(params, true);
  return { date, timestamp, action, event, params }

}
