// (C) 2007-2014 GoodData Corporation
import "isomorphic-fetch";
import fetchMock from "fetch-mock";
import { ClientsModule } from "../../src/admin/clients";
import { XhrModule } from "../../src/xhr";

const createClientsModule = () => new ClientsModule(new XhrModule(fetch, {}));

describe("clients", () => {
    describe("with fake server", () => {
        afterEach(() => {
            fetchMock.restore();
        });

        describe("getClientUsers", () => {
            const clientUsersPayload = JSON.stringify({
                clientUsers: {
                    items: [
                        {
                            firstName: "joe",
                            lastName: "black",
                            login: "joe.black@gd.com",
                            roles: ["admin"],
                        },
                        {
                            firstName: "noe",
                            lastName: "red",
                            login: "noe.red@gd.com",
                            roles: ["user"],
                        },
                    ],
                    paging: {},
                },
            });

            it("should reject with 400 when client users resource fails", () => {
                fetchMock.mock(
                    // tslint:disable-next-line:max-line-length
                    "/gdc/admin/contracts/contractId/dataproducts/dataproductId/segments/segmentId/domainsegments/domainId/clients/clientId/project/users",
                    400,
                );

                return createClientsModule()
                    .getClientUsers(
                        "contractId",
                        "dataproductId",
                        "domainId",
                        "segmentId",
                        "clientId",
                        null,
                        null,
                    )
                    .then(null, (err: any) => expect(err).toBeInstanceOf(Error));
            });

            it("should return client users", () => {
                fetchMock.mock(
                    // tslint:disable-next-line:max-line-length
                    "/gdc/admin/contracts/contractId/dataproducts/dataproductId/segments/segmentId/domainsegments/domainId/clients/clientId/project/users",
                    {
                        status: 200,
                        body: clientUsersPayload,
                    },
                );

                return createClientsModule()
                    .getClientUsers(
                        "contractId",
                        "dataproductId",
                        "domainId",
                        "segmentId",
                        "clientId",
                        null,
                        null,
                    )
                    .then((result: any) => {
                        expect(result.items.length).toBe(2);
                        expect(result.items[0].fullName).toBe("joe black");
                        expect(result.items[1].fullName).toBe("noe red");
                    });
            });

            it("should use paging", () => {
                fetchMock.mock("/gdc/admin/xxx", {
                    status: 200,
                    body: clientUsersPayload,
                });

                const paging = { next: "/gdc/admin/xxx" };

                return createClientsModule()
                    .getClientUsers(
                        "contractId",
                        "dataproductId",
                        "domainId",
                        "segmentId",
                        "clientId",
                        null,
                        paging,
                    )
                    .then((result: any) => {
                        expect(result.items.length).toBe(2);
                        expect(result.items[0].fullName).toBe("joe black");
                        expect(result.items[1].fullName).toBe("noe red");
                    });
            });
        });

        describe("getClient", () => {
            it("should reject with 400 when client resource fails", () => {
                fetchMock.mock(
                    // tslint:disable-next-line:max-line-length
                    "/gdc/admin/contracts/contractId/dataproducts/dataproductId/segments/segmentId/domainsegments/domainId/clients/clientId?stats=user",
                    400,
                );

                return createClientsModule()
                    .getClient("contractId", "dataproductId", "segmentId", "domainId", "clientId")
                    .then(null, (err: any) => expect(err).toBeInstanceOf(Error));
            });

            it("should return client", () => {
                fetchMock.mock(
                    // tslint:disable-next-line:max-line-length
                    "/gdc/admin/contracts/contractId/dataproducts/dataproductId/segments/segmentId/domainsegments/domainId/clients/clientId?stats=user",
                    {
                        status: 200,
                        body: JSON.stringify({
                            client: {
                                id: "clientId",
                                referencedProject: {
                                    project: {
                                        id: "projectId",
                                    },
                                },
                                links: {
                                    // tslint:disable-next-line:max-line-length
                                    self:
                                        "/gdc/admin/contracts/contractId/dataproducts/dataproductId/segments/segmentId/domainsegments/domainId/clients/clientId",
                                },
                            },
                        }),
                    },
                );

                return createClientsModule()
                    .getClient("contractId", "dataproductId", "segmentId", "domainId", "clientId")
                    .then((result: any) => {
                        expect(result.id).toBe("clientId");
                        expect(result.contractId).toBe("contractId");
                        expect(result.domainId).toBe("domainId");
                        expect(result.dataProductId).toBe("dataproductId");
                        expect(result.segmentId).toBe("segmentId");

                        expect(result.referencedProject.project.id).toBe("projectId");
                    });
            });
        });

        describe("getClients", () => {
            const clientsPayload = JSON.stringify({
                clients: {
                    items: [
                        {
                            client: {
                                id: "clientId1",
                                referencedProject: {
                                    project: {
                                        id: "projectId",
                                    },
                                },
                                links: {
                                    // tslint:disable-next-line:max-line-length
                                    self:
                                        "/gdc/admin/contracts/contractId/dataproducts/dataproductId/segments/segmentId/domainsegments/domainId/clients/clientId1",
                                },
                            },
                        },
                        {
                            client: {
                                id: "clientId2",
                                referencedProject: {
                                    project: {
                                        id: "projectId",
                                    },
                                },
                                links: {
                                    // tslint:disable-next-line:max-line-length
                                    self:
                                        "/gdc/admin/contracts/contractId/dataproducts/dataproductId/segments/segmentId/domainsegments/domainId/clients/clientId2",
                                },
                            },
                        },
                    ],
                    paging: {
                        count: 2,
                    },
                },
            });

            it("should reject with 400 when clients resource fails", () => {
                fetchMock.mock(
                    // tslint:disable-next-line:max-line-length
                    "/gdc/admin/contracts/contractId/dataproducts/dataproductId/segments/segmentId/domainsegments/domainId/clients?stats=user",
                    400,
                );

                return createClientsModule()
                    .getClients("contractId", "dataproductId", "domainId", "segmentId", "clientId", "query")
                    .then(null, (err: any) => expect(err).toBeInstanceOf(Error));
            });

            it("should return clients", () => {
                fetchMock.mock(
                    // tslint:disable-next-line:max-line-length
                    "/gdc/admin/contracts/contractId/dataproducts/dataproductId/segments/segmentId/domainsegments/domainId/clients?stats=user",
                    {
                        status: 200,
                        body: clientsPayload,
                    },
                );

                return createClientsModule()
                    .getClients("contractId", "dataproductId", "segmentId", "domainId", null, null)
                    .then((result: any) => {
                        expect(result.items.length).toBe(2);
                        expect(result.items[0].id).toBe("clientId1");
                        expect(result.items[1].id).toBe("clientId2");
                    });
            });

            it("should return clients with prefix", () => {
                fetchMock.mock(
                    // tslint:disable-next-line:max-line-length
                    "/gdc/admin/contracts/contractId/dataproducts/dataproductId/segments/segmentId/domainsegments/domainId/clients?clientPrefix=somePrefix&stats=user",
                    {
                        status: 200,
                        body: clientsPayload,
                    },
                );

                return createClientsModule()
                    .getClients("contractId", "dataproductId", "segmentId", "domainId", "somePrefix", null)
                    .then((result: any) => {
                        expect(result.items.length).toBe(2);
                        expect(result.items[0].id).toBe("clientId1");
                        expect(result.items[1].id).toBe("clientId2");
                    });
            });

            it("should use paging", () => {
                fetchMock.mock("/gdc/admin/xxx", {
                    status: 200,
                    body: clientsPayload,
                });
                const paging = { next: "/gdc/admin/xxx" };

                return createClientsModule()
                    .getClients("contractId", "dataproductId", "segmentId", "domainId", null, paging)
                    .then((result: any) => {
                        expect(result.items.length).toBe(2);
                        expect(result.items[0].id).toBe("clientId1");
                        expect(result.items[1].id).toBe("clientId2");
                    });
            });
        });
    });
});
