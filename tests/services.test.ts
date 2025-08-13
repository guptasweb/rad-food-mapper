import axios from 'axios';
import { searchByApplicant, searchByStreet, findNearest } from '../src/services/foodTrucksService';

jest.mock('axios');

describe('foodTrucksService', () => {
  let getMock: jest.Mock;

  beforeEach(() => {
    getMock = jest.fn().mockResolvedValue({ data: [] });
    (axios.create as unknown as jest.Mock).mockReturnValue({ get: getMock });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('searchByApplicant builds where with name and status', async () => {
    await searchByApplicant({ name: 'taco', status: 'APPROVED' });
    expect(getMock).toHaveBeenCalledWith('', expect.objectContaining({
      params: expect.objectContaining({ $where: expect.stringContaining("upper(applicant) like upper('%taco%') AND status = 'APPROVED'") }),
    }));
  });

  it('searchByStreet queries address and locationdescription', async () => {
    await searchByStreet({ query: 'SAN' });
    const call = getMock.mock.calls[0][1];
    expect(call.params.$where).toContain("upper(address) like upper('%SAN%')");
    expect(call.params.$where).not.toContain('locationdescription');
  });

  it('findNearest defaults to APPROVED and orders by distance', async () => {
    await findNearest({ lat: 37.78, lng: -122.41, limit: 5 });
    const call = getMock.mock.calls[0][1];
    expect(call.params.$where).toContain('to_number(latitude)');
    expect(call.params.$where).toContain('to_number(longitude)');
    expect(call.params.$order).toBe('applicant ASC');
    expect(call.params.$limit).toBe('5');
  });

  it('findNearest allows ALL statuses', async () => {
    await findNearest({ lat: 37.78, lng: -122.41, limit: 3, status: 'ALL' });
    const call = getMock.mock.calls[0][1];
    expect(call.params.$where.startsWith('status')).toBe(false);
  });

  it("searchByApplicant escapes quotes in name and status", async () => {
    await searchByApplicant({ name: "Bob's", status: 'APPROVED' });
    const call = getMock.mock.calls[0][1];
    expect(call.params.$where).toContain("upper(applicant) like upper('%Bob''s%')");
  });

  it('searchByApplicant ignores status when ALL', async () => {
    await searchByApplicant({ name: 'Taco', status: 'ALL' });
    const call = getMock.mock.calls[0][1];
    expect(call.params.$where).toContain("upper(applicant) like upper('%Taco%')");
    expect(call.params.$where).not.toContain('status =');
  });

  it('findNearest numeric ranges for positive/negative coords', async () => {
    await findNearest({ lat: 37.78, lng: -122.41, limit: 10, status: 'ALL' });
    let call = getMock.mock.calls[0][1];
    let where: string = call.params.$where;
    expect(where).toContain('(to_number(latitude) >= 37 AND to_number(latitude) < 38)');
    expect(where).toContain('(to_number(longitude) > -123 AND to_number(longitude) <= -122)');

    getMock.mockClear();
    await findNearest({ lat: -37.2, lng: 122.9, limit: 10 });
    call = getMock.mock.calls[0][1];
    where = call.params.$where;
    expect(where).toContain('(to_number(latitude) > -38 AND to_number(latitude) <= -37)');
    expect(where).toContain('(to_number(longitude) >= 122 AND to_number(longitude) < 123)');
  });
});

