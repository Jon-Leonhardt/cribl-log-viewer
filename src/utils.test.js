import { render, screen } from '@testing-library/react';
import {ConvertToIso,convertToHourlyDate,aggDatesbyHour,filterByDay,getDays} from './utils.js'

describe("ConvertToIso function", () => {
    it('It returns a string', () => {
        const date = new Date();
        expect(typeof ConvertToIso(1724319652599)).toBe('string'); 
        expect(typeof ConvertToIso(date)).toBe('string'); 
    });
    it('It returns the correct ISO date', () => {
        const date = new Date(1724265256624);
        expect(ConvertToIso(1724319652599)).toEqual('2024-08-22T09:40:52.599Z'); 
        expect(ConvertToIso(1724265256624)).toEqual('2024-08-21T18:34:16.624Z'); 
        expect(ConvertToIso(date)).toEqual('2024-08-21T18:34:16.624Z'); 
    });

});

describe("convertToHourlyDate function", () => {
    it('It returns a string', () => {
        const date = new Date();
        expect(typeof convertToHourlyDate(1724319652599)).toBe('string'); 
        expect(typeof convertToHourlyDate(date)).toBe('string'); 
    });
    it('It returns the correct date in YYYY-MM-DD HH:MM Format', () => {
        const date = new Date(1724265256624);
        const isoDate = new Date('2024-08-21T18:34:16.624Z');
        expect(convertToHourlyDate(1724319652599)).toEqual('2024-08-22 02:00'); 
        expect(convertToHourlyDate(1724265256624)).toEqual('2024-08-21 11:00'); 
        expect(convertToHourlyDate(date)).toEqual('2024-08-21 11:00'); 
        expect(convertToHourlyDate(isoDate)).toEqual('2024-08-21 11:00'); 
    });

});

describe("aggDatesbyHour function", () => {
    const arrayOfDates =[
        '2024-08-21 11:00',
        '2024-08-21 11:00',
        '2024-08-21 11:00',
        '2024-08-21 01:00',
        '2024-08-22 12:00',
        '2024-08-22 12:00',
        '2024-08-21 11:00',
        '2024-08-21 11:00',
        '2024-08-20 01:00',
        '2024-08-20 02:00'
    ];
    const correctKey = {'2024-08-21 11:00': 5,'2024-08-21 01:00':1,'2024-08-22 12:00': 2,'2024-08-20 01:00': 1,'2024-08-20 02:00':1};

    it('returns an array of objects', () => {
        expect(typeof aggDatesbyHour(arrayOfDates)).toBe('object'); 
        expect(Array.isArray(aggDatesbyHour(arrayOfDates))).toEqual(true); 
    });
    test.each(aggDatesbyHour(arrayOfDates))('each element of the array is an object with correct structure', (obj) => {
        expect(typeof obj).toBe('object');
        expect(Object.keys(obj)).toEqual(["val", "count"]);
      });
   it('returns an array of objects with the correct number of elements', () => {
        expect(aggDatesbyHour(arrayOfDates).length).toEqual(5); 
    });
    test.each(aggDatesbyHour(arrayOfDates))('each elemnt of the array should have the correct aggregate count', (obj) => {
        expect(obj.count).toEqual(correctKey[obj.val])
      });

});

describe("filterByDay function", () => {
    const arrayOfAggDates = [
        {val: '2024-08-21 11:00', count:42},
        {val: '2024-08-21 12:00' , count:35},
        {val: '2024-08-21 01:00', count:56},
        {val: '2024-08-22 02:00',count:1},
        {val: '2024-08-22 04:00',count:2},
        {val: '2024-08-22 06:00',count:3},
        {val: '2024-08-22 09:00',count:567},
        {val: '2024-08-24 01:00',count:765},
        {val: '2024-08-26 01:00',count:3},
        {val: '2024-08-26 07:00',count:1},
        {val: '2024-08-27 01:00',count:2}
     ];

    it("returns an array of objects", () => {
        expect(typeof filterByDay('2024-08-21',arrayOfAggDates)).toBe('object'); 
        expect(Array.isArray(filterByDay('2024-08-21',arrayOfAggDates))).toEqual(true); 
    });
    it("returns the correct number of elemnts based on the filter", () => {
        expect(filterByDay('2024-08-21', arrayOfAggDates).length).toEqual(3);
        expect(filterByDay('2024-08-22', arrayOfAggDates).length).toEqual(4);
        expect(filterByDay('2024-08-24', arrayOfAggDates).length).toEqual(1);
        expect(filterByDay('2024-08-26', arrayOfAggDates).length).toEqual(2);
        expect(filterByDay('2024-08-27', arrayOfAggDates).length).toEqual(1);

    });
});
describe("getDays function", () => {
    const arrayOfAggDates = [
        {val: '2024-08-21 11:00',count:42},
        {val: '2024-08-21 12:00' ,count:35},
        {val: '2024-08-21 01:00',count:56},          
        {val: '2024-08-22 02:00',count:1},
        {val: '2024-08-22 04:00',count:2},
        {val: '2024-08-22 06:00',count:3},
        {val: '2024-08-22 09:00',count:567},
        {val: '2024-08-24 01:00',count:765},
        {val: '2024-08-26 01:00',count:3},
        {val: '2024-08-26 07:00',count:1},
        {val: '2024-08-27 01:00',count:2},
        {val: '2024-08-28 09:00',count:567},
        {val: '2024-08-28 10:00',count:0},
        {val: '2024-08-29 01:00',count:765},
        {val: '2024-09-02 01:00',count:3},
        {val: '2024-09-03 07:00',count:1}
    ];
    const orderKey =['2024-09-03','2024-09-02','2024-08-29','2024-08-28','2024-08-27','2024-08-26','2024-08-24','2024-08-22','2024-08-21']   
    
    it("returns an array of strings of the proper length", () => {
        expect(typeof getDays(arrayOfAggDates)).toBe('object'); 
        expect(getDays(arrayOfAggDates).length).toEqual(9); 
        expect(Array.isArray(getDays(arrayOfAggDates))).toEqual(true); 
    });
    let i = 0;
    test.each(getDays(arrayOfAggDates))('each element should be a unique date string in the YYYY-MM-DD format and in descending order', (day) => {
        expect(typeof day).toBe('string');
        expect(day).toEqual(orderKey[i]);
        i++;
    });
      

});

