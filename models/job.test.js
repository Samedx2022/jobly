const { sqlForPartialUpdate } = require("../helpers/sql");
const db = require("../db.js");
const Job = require("./job");
const { BadRequestError, NotFoundError } = require("../expressError");

beforeAll(async () => {});

beforeEach(async () => {
  // Insert a company to associate with jobs
  await db.query(`INSERT INTO companies ...`);

  // Insert a job to test update and remove
  await db.query(`INSERT INTO jobs (title, salary, equity, company_handle) VALUES ('Test Job', 100000, '0.1', 'testcompany')`);
});

afterEach(async () => {
  // Delete all entries after each test
  await db.query(`DELETE FROM jobs`);
  await db.query(`DELETE FROM companies`);
});

afterAll(async () => {
  // Close db connection or any other cleanup
  await db.end();
});

describe("Job.create", () => {
  test("works: create a job", async () => {
    let job = await Job.create({
      title: "New Test Job",
      salary: 120000,
      equity: '0',
      company_handle: 'testcompany'
    });

    expect(job).toEqual({
      id: expect.any(Number),
      title: "New Test Job",
      salary: 120000,
      equity: '0',
      company_handle: 'testcompany'
    });
  });

  test("fails: create a job with duplicate title for same company", async () => {
    try {
      await Job.create({
        title: "New Test Job",
        salary: 120000,
        equity: '0',
        company_handle: 'testcompany'
      });
      await Job.create({
        title: "New Test Job",
        salary: 130000,
        equity: '0.2',
        company_handle: 'testcompany'
      });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

describe("Job.findAll", () => {
  test("works: find all jobs", async () => {
    const jobs = await Job.findAll();
    expect(jobs).toEqual([
      {
        id: expect.any(Number),
        title: "Test Job",
        salary: 100000,
        equity: '0.1',
        company_handle: 'testcompany'
      },
    ]);
  });
});

describe("Job.get", () => {
  test("works: get a job by id", async () => {
    let newJob = await Job.create({
      title: "New Test Job",
      salary: 120000,
      equity: '0',
      company_handle: 'testcompany'
    });
    let job = await Job.get(newJob.id);
    expect(job).toEqual(newJob);
  });

  test("not found if no such job", async () => {
    try {
      await Job.get(0); // assuming 0 is an invalid id
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

describe("Job.update", () => {
  test("works: update a job", async () => {
    let job = await Job.create({
      title: "New Test Job",
      salary: 120000,
      equity: '0',
      company_handle: 'testcompany'
    });
    let updateData = {
      title: "Updated Test Job",
      salary: 130000,
      equity: '0.2'
    };
    let updatedJob = await Job.update(job.id, updateData);
    expect(updatedJob).toEqual({
      ...job,
      ...updateData
    });
  });

  test("not found if no such job", async () => {
    try {
      await Job.update(0, { // assuming 0 is an invalid id
        title: "Updated Test Job",
        salary: 130000,
        equity: '0.2'
      });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

describe("Job.remove", () => {
  test("works: delete a job", async () => {
    let job = await Job.create({
      title: "New Test Job",
      salary: 120000,
      equity: '0',
      company_handle: 'testcompany'
    });
    await Job.remove(job.id);
    const res = await db.query("SELECT id FROM jobs WHERE id = $1", [job.id]);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such job", async () => {
    try {
      await Job.remove(0); // assuming 0 is an invalid id
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});