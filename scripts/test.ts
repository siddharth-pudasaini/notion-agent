import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});
console.log(process.env.NOTION_API_KEY);
Object.keys(notion).forEach((key) => {
  console.log(key, typeof notion[key as keyof typeof notion]);
});

export const getLayout = async (pageId: string) => {
  const page = await notion.pages.retrieve({ page_id: pageId });
  return page;
};
