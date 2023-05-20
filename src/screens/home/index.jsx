import React, { useState, useEffect } from "react";
import { Menubar } from "primereact/menubar";
import { PanelMenu } from "primereact/panelmenu";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Paginator } from "primereact/paginator";
import myData from "../../helpers/api/data.json";

import PrimeReact from "primereact/api";

export const Home = () => {
  const [data, setData] = useState([]);
  const [sortKey, setSortKey] = useState(null);
  const [visible, setVisible] = useState(false);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(12);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const uniqueCategories = [...new Set(data.map((item) => item.title))];

  const items = [
    {
      label: "Home",
      icon: "pi pi-fw pi-home",
      command: () => {
        setFilteredData(data);
        setSelectedCategory("");
      },
    },
    ...uniqueCategories.map((title) => {
      return {
        label: title,
        icon: "pi pi-fw pi-file",
        command: () => {
          filterData(title);
        },
      };
    }),
  ];

  const sortOptions = [
    { label: "Alfabetik (Artan)", value: "title:asc" },
    { label: "Alfabetik (Azalan)", value: "title:desc" },
    { label: "Tarih (Artan)", value: "published_date:asc" },
    { label: "Tarih (Azalan)", value: "published_date:desc" },
    { label: "Benzerlik (Artan)", value: "Similarity:asc" },
    { label: "Benzerlik (Azalan)", value: "Similarity:desc" },
  ];

  useEffect(() => {
    setData(myData);
    setFilteredData(myData);
    setTotalRecords(myData.length);
    setSortKey("Similarity:desc");
  }, []);

  useEffect(() => {
    setSortKey("Similarity:desc");
  }, [selectedCategory]);

  useEffect(() => {
    if (sortKey) {
      let sortedData = [...filteredData];
      sortedData.sort((a, b) => {
        const [key, order] = sortKey.split(":");
        if (a[key] > b[key]) {
          return order === "asc" ? 1 : -1;
        } else if (a[key] < b[key]) {
          return order === "asc" ? -1 : 1;
        }
        return 0;
      });
      setFilteredData(sortedData);
    }
  }, [sortKey]);

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const filterData = (title) => {
    const filtered = data.filter((item) => item.title === title);
    setFilteredData(filtered);
    setSelectedCategory(title);
  };

  const toggleMenu = () => {
    setVisible(!visible);
  };

  const calculateColor = (similarity) => {
    const similarityValue = Number(similarity);

    if (similarityValue >= 75) {
      return "#00cc00"; // Yeşil
    } else if (similarityValue >= 50) {
      return "#ffcc00"; // Turuncu
    } else if (similarityValue >= 25) {
      return "#ff9933"; // Açık Turuncu
    } else {
      return "#ff0000"; // Kırmızı
    }
  };

  const handleCardClick = (url) => {
    window.open(url, "_blank");
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div>
      <div className="header fixed top-0 w-full bg-white z-50 shadow">
        <Menubar
          start={
            <div className="ml-8 flex items-center w-full ">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("");
                  setFilteredData(data);
                }}
              >
                <img src="/logo.png" alt="logo" className="w-36" />
              </button>
              <span className="menubar-divider" />
              <span className="text-gray-500 text-lg font-semibold">
                {selectedCategory || "Home"}
              </span>
            </div>
          }
          end={
            <div className="flex items-center mr-4 gap-8">
              <Dropdown
                value={sortKey}
                options={sortOptions}
                onChange={(e) => setSortKey(e.value)}
                placeholder="Sırala"
                className="p-mr-2"
              />
              <Button
                icon="pi pi-bars"
                onClick={toggleMenu}
                className="p-button-text p-button-rounded p-button-plain"
              />
            </div>
          }
        />
      </div>

      <Sidebar
        visible={visible}
        onHide={() => setVisible(false)}
        style={{ width: "30%", paddingTop: "1em" }}
      >
        <PanelMenu model={items} style={{ width: "100%" }} />
      </Sidebar>

      <div
        style={{
          marginLeft: visible ? "30%" : "0",
          transition: "margin-left .5s ease-out",
          padding: "1em",
          marginTop: "4.5rem", // Adjust the margin top to compensate for the fixed header
        }}
      >
        <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {filteredData.slice(first, first + rows).map((item) => (
            <div key={item.id}>
              <Card
                className="card-container"
                title={item.title}
                subTitle={item.published_date}
                style={{
                  marginBottom: "2em",
                  position: "relative",
                  zIndex: 1,
                  minHeight: "500px",
                }}
                footer={
                  <div className="flex flex-row items-center justify-around">
                    <div
                      className="similarity-value"
                      style={{
                        background: calculateColor(item.Similarity),
                      }}
                    >
                      {item.Similarity.toFixed(2)}
                    </div>
                    <Button
                      label="Detay Görüntüle"
                      className="p-button-outlined p-button-primary mt-4"
                      onClick={() => handleCardClick(item.url)}
                    />
                  </div>
                }
              >
                <img
                  className="card-image rounded-md "
                  alt={item.title}
                  src={item.urlToImage}
                  style={{
                    objectFit: "cover",
                    height: "200px",
                    width: "100%",
                  }}
                />
                <p>{truncateText(item.description, 100)}</p>
              </Card>
            </div>
          ))}
        </div>
        <Paginator
          first={first}
          rows={rows}
          totalRecords={filteredData.length}
          rowsPerPageOptions={[12, 24, 48]}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};
