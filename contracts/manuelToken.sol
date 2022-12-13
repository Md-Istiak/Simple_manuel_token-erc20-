// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

contract ManuelToken {
    //token variable
    string private name;
    string private symbol;
    uint8 private constant decimals = 18;
    uint256 private totalSupply;
    address private immutable i_owner;

    //balnace of mapping  array with address and owned balances
    mapping(address => uint256) private balanceOf;
    mapping(address => mapping(address => uint256)) private allowonce;

    //events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );
    event Burn(address indexed from, uint256 value);

    //initializing constructor
    constructor(
        string memory _tokenName,
        string memory _tokenSymbol,
        uint256 initialSupply
    ) {
        totalSupply = initialSupply * 10 ** uint256(decimals);
        balanceOf[msg.sender] = totalSupply;
        name = _tokenName;
        symbol = _tokenSymbol;
        i_owner = msg.sender;
    }

    //transfer properties to transfer token
    function _transfer(
        address from,
        address to,
        uint256 value
    ) internal returns (bool) {
        require(from != address(0), "invalid recieving  address");
        require(to != address(0), "invalid sending address");
        require(balanceOf[from] != 0, "invalid Transaction");
        require(
            balanceOf[from] >= value * 10 ** uint256(decimals),
            "insuficient funds"
        );
        require(
            balanceOf[to] + value * 10 ** uint256(decimals) > balanceOf[to],
            "invalid transaction"
        );

        uint256 previousBalances = balanceOf[from] + balanceOf[to];
        balanceOf[from] -= value * 10 ** uint256(decimals);
        balanceOf[to] += value * 10 ** uint256(decimals);
        uint256 finalBalances = balanceOf[from] + balanceOf[to];
        emit Transfer(from, to, value);
        assert(previousBalances == finalBalances);
        return true;
    }

    //modifier for authentication!
    modifier onlyOwner() {
        require(msg.sender == i_owner, "Unauthenticated Transaction");
        _;
    }

    /**@dev transfer token to holder function
     * @param to holderAccount , value
     */
    function transfer(
        address to,
        uint256 value
    ) external onlyOwner returns (bool) {
        _transfer(msg.sender, to, value);
        allowonce[msg.sender][to] += value * 10 ** uint256(decimals);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool) {
        require(allowonce[msg.sender][from] != 0, "invalid transaction");
        _transfer(from, to, value);
        allowonce[msg.sender][to] += value * 10 ** uint256(decimals);
        allowonce[msg.sender][from] -= value * 10 ** uint256(decimals);
        return true;
    }

    //approve function for new token holder
    function approve(
        address spender,
        uint256 value
    ) public onlyOwner returns (bool) {
        require(
            balanceOf[spender] + value * 10 ** uint256(decimals) >
                balanceOf[spender]
        );
        allowonce[msg.sender][spender] += value * 10 ** uint256(decimals);
        balanceOf[spender] += value * 10 ** uint256(decimals);
        totalSupply += value * 10 ** uint256(decimals);
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function aprrovalIncrease(
        address spender,
        uint256 value
    ) external onlyOwner returns (bool) {
        require(
            allowonce[msg.sender][spender] == balanceOf[spender],
            "invalid transaction"
        );
        allowonce[msg.sender][spender] += value * 10 ** uint256(decimals);
        balanceOf[spender] += value * 10 ** uint256(decimals);
        totalSupply += value * 10 ** uint256(decimals);
        return true;
    }

    function approvaldecrease(
        address spender,
        uint256 value
    ) external onlyOwner returns (bool) {
        require(
            balanceOf[spender] == allowonce[msg.sender][spender],
            "invalid transaction"
        );
        allowonce[msg.sender][spender] -= value * 10 ** uint256(decimals);
        balanceOf[spender] -= value * 10 ** uint256(decimals);
        totalSupply -= value * 10 ** uint256(decimals);
        return true;
    }

    function burnToken(
        uint256 value
    ) external onlyOwner returns (bool success) {
        require(
            balanceOf[msg.sender] >= value * 10 ** uint256(decimals),
            "insuficient balance"
        );
        require(totalSupply >= value * 10 ** uint256(decimals));
        balanceOf[msg.sender] -= value * 10 ** uint256(decimals);
        totalSupply -= value * 10 ** uint256(decimals);
        emit Burn(msg.sender, value);
        return true;
    }

    function burnFrom(
        address spender,
        uint256 value
    ) external onlyOwner returns (bool) {
        require(balanceOf[spender] >= value * 10 ** uint256(decimals));
        require(totalSupply >= value * 10 ** uint256(decimals));
        balanceOf[spender] -= value * 10 ** uint256(decimals);
        totalSupply -= value * 10 ** uint256(decimals);
        allowonce[msg.sender][spender] -= value ** uint256(decimals);
        emit Burn(spender, value);
        return true;
    }

    function totalSupplyOfToken() external view returns (uint256) {
        return totalSupply;
    }

    function balance(address tokenHolder) external view returns (uint256) {
        return balanceOf[tokenHolder];
    }

    function allowonceOfOwner(
        address tokenSpender
    ) external view returns (uint256) {
        return allowonce[msg.sender][tokenSpender];
    }

    function tokenName() external view returns (string memory) {
        return name;
    }

    function tokenSymbol() external view returns (string memory) {
        return symbol;
    }
}
