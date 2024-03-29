import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { Searchbar } from "../../components/Searchbar";
import { CarrousselRecipe } from "../../components/CarrousselRecipe";
import { fetchRecipes } from "../../calls/mongo/recipe";
import { RecipeModel } from "../../models/Recipe";
import TitleCategory from "../../components/TitleCategory";

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = () => {
  const [recipes, setRecipes] = useState<RecipeModel[]>([]);

  useEffect(() => {
    fetchRecipes()
      .then((data: RecipeModel[]) => {
        const reversedData = [...data].reverse();
        console.log(reversedData);
        setRecipes(reversedData);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="homePage">
      <Header />
      <Searchbar />
      <div className="titleHomePage">
        <TitleCategory title={"Nos dernières recettes"} />
      </div>
      <CarrousselRecipe recipes={recipes} />
    </div>
  );
};

export default HomePage;
