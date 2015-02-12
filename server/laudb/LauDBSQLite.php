<?php

/*
 * Copyright (C) 2015 Matheus Castello
 * 
 *  There is no peace only passion
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

require_once 'LauDB.php';

class LauDBSQLite implements LauDB
{

    private $_conn;
    private $_elems;
    private $_elemArray;
    private $_countArray;
    private $_elem;

    /**
        * Constructor </br>
        * $filename: Path to data base file
        */

    function __construct($filename) 
    {
        try 
        {
            $this->_conn = new PDO('sqlite:' . $filename);
            $this->_conn->exec("PRAGMA synchronous=OFF");

            function sqrtt($val) 
            {
                return sqrt($val);
            }

            $this->_conn->sqliteCreateFunction('sqrt', 'sqrtt', 1);
        } 
        catch (Exception $e) 
        {
            echo 'LAU DB ERROR: ' . $e;
            die($e);
        }
    }

    /**
        * Executa comando sql </br>
        * $cmd: String sql </br>
        * return: Array with data returned
        * @return Array
        */
    public function query($cmd) 
    {
        $this->_elems = $this->_conn->query($cmd);
        
        if ($this->_elems) 
        {
            $this->_elemArray = $this->_elems->fetchAll(PDO::FETCH_NUM);
            $this->_countArray = count($this->_elemArray);
            return $this->_elemArray;
        } 
        else 
        {
            $arrE = $this->_conn->errorInfo();
            echo 'LAU DB ERROR: ' . $arrE[2] . " :: '" . $cmd . "'";
        }
    }

    /**
        * Execute sql command without return data
        * @param string $cmd
        * @return bool
        */
    public function noReturnDataQuery($cmd) 
    {
        $this->_elems = $this->_conn->query($cmd);
        if ($this->_elems) 
        {
            return true;
        } 
        else
        {
            $arrE = $this->_conn->errorInfo();
            echo 'LAU DB ERROR: ' . $arrE[2] . " :: '" . $cmd . "'";
            return false;
        }
    }

    /**
        * Get data from table in specific row
        * @param int $row
        * @param string $table
        * @return string
        */
    public function row($row, $table) 
    {
        for ($i = 0; $i < $this->countRows(); $i++) 
        {
            if ($i == $row) 
            {
                $tmp = $this->_elemArray[$i][$table];
                break;
            }
        }

        return $tmp;
    }

    /**
        * Execute sql command </br>
        * @param string $cmd String sql </br>
        * @return bool
        */
    public function execute($cmd) 
    {
        //echo $cmd;
        if ($this->_conn->exec($cmd)) 
        {
            return true;
        } 
        else
        {
            return false;
        }
    }

    /**
        * @return int
        */
    public function getLastInsertRowid()
    {
        $this->noReturnDataQuery("SELECT last_insert_rowid();");
        if ($this->_elems)
        {
            return $this->prox()->{"last_insert_rowid()"};
        }
        return null;
    }

    /**
        * @return int
        */
    public function rowCount() 
    {
        return $this->_elems->rowCount();
    }

    /**
        * Return the object data with fields from the prox row </br>
        * @return PDOStatement
        */
    public function prox() 
    {
        return $this->_elem = $this->_elems->fetchObject();
    }

    /**
        * Retorna o objeto resgatado pelo prox() </br>
        * @return PDOStatement
        */
    public function getActualObjectRow() 
    {
        return $this->_elem;
    }

    public function close() 
    {
        $this->_conn = null;
    }
}
