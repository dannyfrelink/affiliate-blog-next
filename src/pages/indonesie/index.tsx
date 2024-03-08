import HeaderImage from "../../assets/header/blogs.jpg";
import { useAppContext } from "../../config/AppContext";
import {
  Header,
  Overview,
  BaseText,
  ListOverview,
  H3,
  Footer,
  H2,
  CountryTag,
  ScrollBar,
} from "@/helpers/dynamicImports";
import Link from "next/link";
import ThermostatRoundedIcon from "@mui/icons-material/ThermostatRounded";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import FlightRoundedIcon from "@mui/icons-material/FlightRounded";
import React from "react";
import { GetStaticProps } from "next";
import Image from "next/image";
import { MetadataProps } from "..";
import { client } from "@/helpers/contentful";
import { Images } from "@/components/pages/blogs/BlogContent";

export interface Content {
  fields: {
    image: {
      fields: {
        title: string;
        file: {
          url: string;
        };
      };
    };
    section: string;
    text: string;
  };
}

export interface Destination {
  id: number;
  metaTitle: string;
  metaDesc: string;
  date: string;
  href: string;
  coverImage: {
    fields: {
      title: string;
      file: {
        url: string;
      };
    };
  };
  title: string;
  headers: string[];
  content: Content[];
  images: Images[];
  featured?: string;
  carousel?: boolean;
}

export interface BlogsData {
  [destination: string]: Destination[];
}

interface BlogsProps {
  blogData: BlogsData;
  metaData: MetadataProps;
}

const BlogOverview: React.FC<BlogsProps> = React.memo(({ blogData }) => {
  const { screenSize } = useAppContext();
  const destinations = Object.keys(blogData);

  const tags = [
    {
      icon: <ThermostatRoundedIcon />,
      title: "Beste reistijd",
      value: "April - Oktober",
    },
    {
      icon: <AttachMoneyRoundedIcon />,
      title: "Valuta",
      value: "Indonesische Rupiah",
    },
    {
      icon: <AccessTimeFilledRoundedIcon />,
      title: "Tijdsverschil",
      value: "6/7 uur",
    },
    {
      icon: <FlightRoundedIcon />,
      title: "Vliegtijd",
      value: "16 uur",
    },
  ];

  return (
    <ScrollBar>
      <div>
        <Header
          HeaderImage={() => (
            <Image
              width={2000}
              height={1300}
              src={HeaderImage}
              alt="Rijstvelden Indonesië"
            />
          )}
          title="Indonesië"
          subTitle={
            "Waar gastvrijheid, cultuur, lekker eten en prachtige natuur allemaal samen komen."
          }
        />

        <Overview destinations={destinations}>
          <section className="max-w-[1000px] mx-auto">
            <div
              className={`${
                screenSize < 1000
                  ? "grid grid-cols-2 gap-x-2 gap-y-6 text-center max-w-[650px] mx-auto mb-7"
                  : `flex ${screenSize < 1250 ? "mb-10" : "mb-14"}`
              }`}
            >
              {tags.map((tag, index) => {
                return (
                  <CountryTag
                    key={index}
                    title={tag.title}
                    value={tag.value}
                    icon={tag.icon}
                  />
                );
              })}
            </div>

            <H2
              className={`text-center ${screenSize < 1250 ? "mb-4" : "mb-6"}`}
            >
              Reizen naar Indonesië
            </H2>
            <article
              className={`text-center ${
                screenSize < 1250
                  ? "[&>*:not(:last-child)]:mb-3"
                  : "[&>*:not(:last-child)]:mb-4"
              }`}
            >
              <BaseText>
                Indonesië is echt onze favoriete reisbestemming! Je kunt hier
                alles vinden, van prachtige stranden tot groene jungles en van
                helderblauw water tot een interessante cultuur. Ook kan je
                ervoor kiezen om goedkoop te reizen, een mooie middenweg te
                nemen of uit te pakken met mega luxe verblijven. De bevolking is
                ontzettend gastvrij en behulpzaam en voor de Indische keuken kan
                je ons echt wakker maken. In de natuur kan je hier van alles
                vinden, denk aan watervallen, vulkanen, mooie uitzichtpunten en
                niet te vergeten: rijstvelden!
              </BaseText>
            </article>
          </section>

          <section className="[&>div:first-child>div]:!mt-0 [&>div:first-child>div]:!pt-0">
            {destinations.map((dest, index) => {
              const blogsPerDest = blogData[dest];

              return (
                <ListOverview title="Blogs over" dest={dest} key={index}>
                  {blogsPerDest.map((blog, index) => {
                    const imageSrc = `https:${blog.coverImage.fields.file.url}`;
                    const imageAlt = blog.coverImage.fields.title;

                    return (
                      <Link
                        href={`/indonesie/${blog.href}`}
                        className={`relative ${
                          screenSize < 900
                            ? "w-full max-w-[550px] h-[56vw] max-h-[325px] [&>*:not(:nth-child[1])]:mt-2 mt-5"
                            : `w-[36vw] max-w-[650px] h-[24vw] max-h-[375px] mx-auto ${
                                screenSize < 1250
                                  ? "[&>*:not(:nth-child[1])]:mt-2.5"
                                  : "[&>*:not(:nth-child[1])]:mt-3"
                              }`
                        }`}
                        key={index}
                      >
                        <div className="absolute bottom-0 w-full rounded-2xl h-full opacity-60 bg-gradient-to-t from-gray-700 via-transparent via-80% to-gray-400"></div>

                        <Image
                          width={500}
                          height={500}
                          src={imageSrc}
                          alt={imageAlt}
                          className="w-screen h-full object-cover object-center rounded-2xl shadow-subtle"
                        />

                        <H3 className="absolute w-[90%] left-[5%] text-primary bottom-4">
                          {blog.title}
                        </H3>
                      </Link>
                    );
                  })}
                </ListOverview>
              );
            })}
          </section>
        </Overview>

        <Footer />
      </div>
    </ScrollBar>
  );
});

export const getStaticProps: GetStaticProps<BlogsProps> = async () => {
  const allMetaData: {
    [path: string]: MetadataProps;
  } = require("../../data/metaData.json");

  const contentfulRes = await client.getEntries({ content_type: "blog" });
  const blogData = contentfulRes.items
    .reverse()
    .reduce((group: any, blogs: any) => {
      const location = blogs.fields.location;
      group[location] = group[location] ?? [];
      group[location].push(blogs.fields);
      return group;
    }, {});

  return {
    props: {
      blogData,
      metaData: allMetaData["/indonesie"],
    },
  };
};

export default BlogOverview;
