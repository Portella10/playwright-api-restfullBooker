// @ts-check
import { test, expect } from "@playwright/test";

var recebendoToken;

test("Consultando as reservas cadastradas", async ({ request }) => {
  const response = await request.get("/booking");
  console.log(await response.json());
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
});

test("Consultando uma reserva por ID", async ({ request }) => {
  //Fazendo a requisição para consultar uma reserva específica
  const response = await request.get("/booking/4536");
  //Trasnformando a resposta em JSON
  const responseBody = await response.json();
  console.log(responseBody);
  //Verificando dados da reserva
  expect(responseBody.firstname).toBe("Jones");
  expect(responseBody.lastname).toBe("Ports");
  expect(responseBody.totalprice).toBe(250);
  expect(responseBody.depositpaid).toBeTruthy();
  expect(responseBody.bookingdates.checkin).toBe("2025-04-19");
  expect(responseBody.bookingdates.checkout).toBe("2025-04-21");
  expect(responseBody.additionalneeds).toBe("Breakfast");
  //Verificando status da resposta
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
});
test("Consultando dados de uma reserva apenas com as propriedades", async ({
  request,
}) => {
  //Fazendo a requisição para consultar uma reserva específica
  const response = await request.get("/booking/1185");
  //Trasnformando a resposta em JSON
  const responseBody = await response.json();
  console.log(responseBody);
  //Verificando se as propriedades existem na resposta
  expect(responseBody).toHaveProperty("firstname");
  expect(responseBody).toHaveProperty("lastname");
  expect(responseBody).toHaveProperty("totalprice");
  expect(responseBody).toHaveProperty("depositpaid");
  expect(responseBody).toHaveProperty("bookingdates");
  expect(responseBody).toHaveProperty("additionalneeds");
  //Verificando status da resposta
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
});

test("Cadastrando uma nova reserva", async ({ request }) => {
  const response = await request.post("/booking", {
    data: {
      firstname: "Jones",
      lastname: "Ports",
      totalprice: 250,
      depositpaid: true,
      bookingdates: {
        checkin: "2025-04-19",
        checkout: "2025-04-21",
      },
      additionalneeds: "Breakfast",
    },
  });
  console.log(await response.json());
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);

  const responseBody = await response.json();
  expect(responseBody.booking).toHaveProperty("firstname", "Jones");
  expect(responseBody.booking).toHaveProperty("lastname", "Ports");
  expect(responseBody.booking).toHaveProperty("totalprice", 250);
  expect(responseBody.booking).toHaveProperty("depositpaid", true);
  expect(responseBody.booking).toHaveProperty("bookingdates");
  expect(responseBody.booking).toHaveProperty("additionalneeds", "Breakfast");
});

test("Atualização parcial", async ({ request }) => {
  // criando o token

  const response = await request.post("/auth", {
    data: {
      username: "admin",

      password: "password123",
    },
  });

  console.log(await response.json());

  // Verificando se a resposta da API está OK

  expect(response.ok()).toBeTruthy();

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  recebendoToken = responseBody.token;

  console.log("Seu token é:" + recebendoToken);

  // Atualizando dados da reserva:

  const partialUpdateRequest = await request.patch("/booking/198", {
    headers: {
      "Content-Type": "application/json",

      Accept: "application/json",

      Cookie: `token=${recebendoToken}`,
    },

    data: {
      firstname: "herbert",

      lastname: "herbertao",

      totalprice: 111,

      depositpaid: false,
    },
  });

  console.log(await partialUpdateRequest.json());

  expect(partialUpdateRequest.ok()).toBeTruthy();

  expect(partialUpdateRequest.status()).toBe(200);

  const partialUpdatedResponseBody = await partialUpdateRequest.json();

  expect(partialUpdatedResponseBody).toHaveProperty("firstname", "herbert");

  expect(partialUpdatedResponseBody).toHaveProperty("lastname", "herbertao");

  expect(partialUpdatedResponseBody).toHaveProperty("totalprice", 111);

  expect(partialUpdatedResponseBody).toHaveProperty("depositpaid", false);
});
