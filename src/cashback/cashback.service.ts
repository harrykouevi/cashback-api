import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../users/user.service';
import { Cashback ,AddCashbackDTO } from './cashback.entity';


@Injectable()
export class CashbackService {
  constructor(
    @InjectRepository(Cashback)
    private cashbacksRepository: Repository<Cashback>,
    

    private userService: UserService,
  ) {}

  async findAll() {
    return this.cashbacksRepository.find();
  }

  //async addCashback(amount: number, transactionId: string, userId: number): Promise<Cashback> {
  async addCashback(body: AddCashbackDTO): Promise<Cashback> {

    const user = await this.userService.findById(body.userId);
    if (!user) {
        throw new Error('User not found');
    }

    // const cashback = this.cashbacksRepository.create({ amount, TransactionDate, UserID, MerchantID, transactionId });
    const cashback = this.cashbacksRepository.create(body);
    await this.cashbacksRepository.save(cashback);

    // Update user's cashback balance
    await this.userService.updateCashbackBalance(body.userId,body.amount);

    return cashback;
    
  }

  //async handlePurchase(userId: number, transactionId: string, purchaseAmount: number) {
  async handlePurchase(body : any) {
    // Calculate cashback (for example, 10% of the purchase amount)
    const cashbackAmount = body.purchaseAmount * 0.10; // 10% cashback
    //return this.addCashback(cashbackAmount, transactionId, userId);
    return this.addCashback(body);
  }
}
